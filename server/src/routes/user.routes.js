import { Router } from "express";
import {
  createPost,
  getPost,
  isUserLoggedIn,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/profile").get(isUserLoggedIn);
router.route("/CreatePost").post(
  upload.fields([
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  createPost
);
router.route("/Post").get(getPost);
console.log("Hello from router");

export default router;
