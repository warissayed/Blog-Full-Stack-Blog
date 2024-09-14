import { Router } from "express";
import {
  loginUser,
  logoutUser,
  profile,
  registerUser,
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/profile").get(profile);
console.log("Hello from router");

export default router;
