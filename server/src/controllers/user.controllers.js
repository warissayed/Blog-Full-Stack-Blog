import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import BlogModel from "../models/Blog.models.js";

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
  console.log("Hello from controller");

  // Log the entire request body to check incoming data
  console.log("Request Body:", req.body);

  const { username, email, password } = req.body;

  // Log to confirm the values from req.body
  console.log("Extracted Data:", username, email, password);

  // If req.body is undefined or any field is missing
  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    // Check if the user already exists
    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Find the newly created user without password field
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
      .json(new ApiResponse(200, decoded, "User is logged in"));
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
  console.log(user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  console.log(user.username);
  const post = await BlogModel.create({
    title,
    summary,
    content,
    user: user._id,
    username: user.username,
  });
  res.json(post);
});
const getPost = asyncHandler(async (req, res) => {
  // const posts = await BlogModel.find();
  // posts.sort((a, b) => b.createdAt - a.createdAt);
  const posts = await BlogModel.find().sort({ createdAt: -1 }).limit(20);

  res.json(posts);
});
const getPostId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const post = await BlogModel.findById(id);

    if (!post) return res.status(404).send("Post not found");

    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post sendsuccessfully"));
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
  const updatedPost = await BlogModel.findByIdAndUpdate(
    req.params.id,
    { title, summary, content },
    { new: true }
  );
  res.json(updatedPost);
});
const deletePost = asyncHandler(async (req, res) => {});

export {
  registerUser,
  loginUser,
  logoutUser,
  isUserLoggedIn,
  createPost,
  getPost,
  getPostId,
  editPost,
  deletePost,
};
