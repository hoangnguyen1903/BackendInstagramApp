import express from "express";
import {
  getAllUsers,
  getUserById,
  updateProfile,
  updatePassword,
  followUser,
  unfollowUser,
} from "../controllers/UserController.js";
import { ProtectMiddleware } from "../middleware/ProtectMiddleware.js";

const router = express.Router();

router.route("/").get(getAllUsers);

router.route("/:id").get(getUserById);

router.route("/profile").put(ProtectMiddleware, updateProfile);

router.route("/update-password").put(ProtectMiddleware, updatePassword);

router.route("/:id/follow").put(ProtectMiddleware, followUser);

router.route("/:id/unfollow").put(ProtectMiddleware, unfollowUser);

export default router;
