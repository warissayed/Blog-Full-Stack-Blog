import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import BlogModel from "../models/Blog.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import * as cloudinary from "cloudinary";
import { io } from "../app.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }

    // Create new user
    const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
      avatar: avatar.url,
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    // Success response
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    console.error("Error during user registration:", error);
    throw new ApiError(500, "Server Error: Unable to register user");
  }
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    const { username } = req.body;

    if (username) {
      const user = await User.findById(username);

      if (user) {
        user.refreshToken = null;
        await user.save({ validateBeforeSave: false });
      }
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  } catch (error) {
    console.error("Error during user logout:", error);
    throw new ApiError(500, "Server Error: Unable to log out user");
  }
});
const isUserLoggedIn = asyncHandler(async (req, res) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Access token is required for authentication");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  try {
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User is logged in"));
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});
const createPost = asyncHandler(async (req, res) => {
  const { title, summary, content } = req.body;
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Access token is required for authentication");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const imageFile = req.files?.file?.[0];

  if (!imageFile) {
    throw new ApiError(400, "Image file is required this error");
  }
  const imageLocalPath = imageFile.path;

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image) {
    throw new ApiError(400, "Error uploading image to Cloudinary");
  }
  const post = await BlogModel.create({
    title,
    summary,
    content,
    image: image.url,
    imagePublicId: image.public_id,
    user: user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, post, "Post created successfully"));
});
const getPost = asyncHandler(async (req, res) => {
  const posts = await BlogModel.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("user", "username avatar");

  res.json(posts);
});
const getPostId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const post = await BlogModel.findById(id)
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar");

    if (!post) return res.status(404).send("Post not found");

    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post send successfully"));
  } catch (error) {
    console.error("Error during sending Post:", error);
    throw new ApiError(500, "Server Error: Unable to log out Post");
  }
});
const editPost = asyncHandler(async (req, res) => {
  const { title, summary, content, userId } = req.body;
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Access token is required for authentication");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );
  const isAuthor = userId === user._id.toString();
  if (!isAuthor) {
    throw new ApiError(403, "You are not authorized to edit this post");
  }

  const post = await BlogModel.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const postImage_id = post.imagePublicId;
  if (!postImage_id) {
    console.error("Image public_id not found in post document");
  } else {
    try {
      const cloudinaryResponse = await cloudinary.uploader.destroy(
        postImage_id
      );
      if (cloudinaryResponse.result !== "ok") {
        console.error("Cloudinary deletion result:", cloudinaryResponse);
        throw new ApiError(500, "Error deleting image from Cloudinary");
      }
    } catch (err) {
      console.error("Error deleting image from Cloudinary:", err);
      throw new ApiError(500, "Error deleting image from Cloudinary");
    }
  }
  const imageFile = req.files?.file?.[0];

  if (!imageFile) {
    throw new ApiError(400, "Image file is required this error");
  }
  const imageLocalPath = imageFile.path;

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image) {
    throw new ApiError(400, "Error uploading image to Cloudinary");
  }

  const updatedPost = await BlogModel.findByIdAndUpdate(
    req.params.id,
    {
      title,
      summary,
      content,
      image: image.url,
      imagePublicId: image.public_id,
      user: user._id,
    },
    { new: true }
  );
  res.json(updatedPost);
});

const deletePost = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Access token is required for authentication");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );

  const isAuthor = userId === user._id.toString();
  if (!isAuthor) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  const post = await BlogModel.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const postImage_id = post.imagePublicId;
  if (!postImage_id) {
    console.error("Image public_id not found in post document");
  } else {
    try {
      const cloudinaryResponse = await cloudinary.uploader.destroy(
        postImage_id
      );
      if (cloudinaryResponse.result !== "ok") {
        console.error("Cloudinary deletion result:", cloudinaryResponse);
        throw new ApiError(500, "Error deleting image from Cloudinary");
      }
    } catch (err) {
      console.error("Error deleting image from Cloudinary:", err);
      throw new ApiError(500, "Error deleting image from Cloudinary");
    }
  }
  const deletedPost = await BlogModel.findByIdAndDelete(req.params.id);
  res.json(deletedPost);
});

// const likePost = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const token =
//     req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     throw new ApiError(401, "Access token is required for authentication");
//   }

//   const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//   const user = await User.findById(decoded._id).select(
//     "-password -refreshToken"
//   );

//   if (!user) {
//     throw new ApiError(404, "User Not Found");
//   }
//   const post = await BlogModel.findById(id);

//   if (!post) {
//     throw new ApiError(404, "Post not found");
//   }

//   const userId = user._id.toString();

//   const isLiked = post.likes.includes(userId);
//   if (isLiked) {
//     //unlike:remove user from like array
//     post.likes = post.likes.filter((like) => like !== userId);
//   } else {
//     post.likes.push(userId);
//   }

//   const updatedPost = await BlogModel.findByIdAndUpdate(id, post, {
//     new: true,
//   });

//   //Emit the updated likes
//   req.io.emit("likeUpdated", {
//     postId: id,
//     likes: updatedPost.likes,
//   });

//   res.json({
//     updatedPost,
//   });
// });
// const likePost = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const token =
//     req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     throw new ApiError(401, "Access token is required for authentication");
//   }

//   const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//   const user = await User.findById(decoded._id).select(
//     "-password -refreshToken"
//   );
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   const post = await BlogModel.findById(id);
//   if (!post) {
//     throw new ApiError(404, "Post not found");
//   }

//   const userId = user._id.toString(); // Convert ObjectId to string
//   const isLiked = post.likes.includes(userId);
//   console.log("UserId:", userId);
//   console.log("Post Likes:", post.likes);
//   console.log("Is Liked:", isLiked);

//   let action = "";

//   if (isLiked) {
//     // Remove like
//     post.likes = post.likes.filter((like) => like !== userId);
//     action = "dislike";
//   } else {
//     // Add like
//     post.likes.push(userId);
//     action = "like";
//   }

//   const updatedPost = await BlogModel.findByIdAndUpdate(id, post, {
//     new: true,
//   });

//   // Emit the updated likes with action
//   req.io.emit("likeUpdated", {
//     postId: id,
//     likes: updatedPost,
//     action,
//   });
//   console.log(updatedPost, id, updatedPost.likes, action);
//   res.json(updatedPost);
// });
const likePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Access token is required for authentication");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const post = await BlogModel.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const userId = user._id.toString(); // Convert the user ID to a string
  const isLiked = post.likes.some((like) => like.toString() === userId); // Check if user ID exists in likes array

  let action = "";

  if (isLiked) {
    // Remove like
    post.likes = post.likes.filter((like) => like.toString() !== userId); // Ensure comparison handles ObjectId
    action = "dislike";
  } else {
    // Add like
    post.likes.push(user._id); // Push the ObjectId directly
    action = "like";
  }

  const updatedPost = await post.save(); // Save the updated post

  // Emit the updated likes array and action to connected clients
  req.io.emit("likeUpdated", {
    postId: id,
    likes: updatedPost.likes.map((like) => like.toString()), // Convert ObjectId to string for the frontend
    action, // 'like' or 'dislike'
  });

  console.log("Emitting likeUpdated Event:", {
    postId: id,
    likes: updatedPost.likes,
    action,
  });

  res.json({ likes: updatedPost.likes.map((like) => like.toString()) }); // Ensure frontend receives string IDs
});

// const blogComment = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { content } = req.body;
//   const post = await BlogModel.findById(id);
//   const token =
//     req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     throw new ApiError(401, "Access token is required for authentication");
//   }
//   const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//   const user = await User.findById(decoded._id).select(
//     "-password -refreshToken"
//   );
//   const userId = user._id.toString();
//   post.comments.push({ content, user: userId, date: new Date() });
//   const updatedPost = await BlogModel.findByIdAndUpdate(id, post, {
//     new: true,
//   });

//   io.emit("comments", {
//     postId: id,
//     comments: updatedPost,
//   });

//   res.json(updatedPost);
// });
const blogComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Access token is required for authentication");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const post = await BlogModel.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const newComment = {
    content,
    user: {
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
    },
    date: new Date(),
  };

  post.comments.push(newComment);

  const updatedPost = await BlogModel.findByIdAndUpdate(id, post, {
    new: true,
  });

  // Emit the new comment event
  req.io.emit("comments", {
    postId: id,
    comment: newComment, // Emit only the new comment
  });

  res.json(updatedPost);
});

//created like post and blog comments

export {
  registerUser,
  loginUser,
  logoutUser,
  isUserLoggedIn,
  createPost,
  deletePost,
  getPost,
  getPostId,
  editPost,
  likePost,
  blogComment,
};
