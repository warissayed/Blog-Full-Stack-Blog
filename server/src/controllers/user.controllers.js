import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

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
//TODO its not working
const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

// const profile = asyncHandler(async (req, res) => {
//   const user = await User.findById(decode._id).select(
//     "-password -refreshToken"
//   );
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }
//   return res.status(200).json(new ApiResponse(200, user, "User profile"));
// });
const isUserLoggedIn = asyncHandler(async (req, res) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  // Debugging logs to track token extraction
  console.log("Token from cookies:", req.cookies?.accessToken);
  console.log("Token from authorization header:", req.headers?.authorization);

  if (!token) {
    throw new ApiError(401, "Access token is required for authentication");
  }
  console.log("Token:", token);

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  try {
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );
    console.log("User:", user);

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

export { registerUser, loginUser, logoutUser, isUserLoggedIn };
