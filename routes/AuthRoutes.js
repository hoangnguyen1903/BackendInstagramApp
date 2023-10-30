import express from "express";
import {
  login,
  register,
  getProfile,
  updatePassword,
} from "../controllers/AuthController.js";
import { ProtectMiddleware } from "../middleware/ProtectMiddleware.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);

// Route for updating the user's password
router.route("/update-password").put(ProtectMiddleware, updatePassword);

router.route("/profile").get(ProtectMiddleware, getProfile);

export default router;
