import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export { registerUser };
