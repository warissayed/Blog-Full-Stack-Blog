import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controllers.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
console.log("Hello from router");

export default router;
