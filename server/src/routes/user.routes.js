import { Router } from "express";
import {
  isUserLoggedIn,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/profile").get(isUserLoggedIn);
router.route("/CreatePost").post();
console.log("Hello from router");

export default router;
