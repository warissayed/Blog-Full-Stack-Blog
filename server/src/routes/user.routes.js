import { Router } from "express";
import {
  blogComment,
  createPost,
  deletePost,
  editPost,
  getPost,
  getPostId,
  isUserLoggedIn,
  likePost,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
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
router.route("/Post/:id").get(getPostId);
router.route("/editPost/:id").put(
  upload.fields([
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  editPost
);
router.route("/deletePost/:id").delete(deletePost);
router.route("/blogs/:id/like").post(likePost);
router.route("/blogs/:id/comment").post(blogComment);
console.log("Hello from router");

export default router;
