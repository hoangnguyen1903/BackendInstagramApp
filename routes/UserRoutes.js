import express from "express";
import {
  getAllUsers,
  getUser,
  updateProfile,
  followUser,
} from "../controllers/UserController.js";

const router = express.Router();

// Route to get all users
router.route("/").get(getAllUsers);

// Route to get a specific user by ID
router.route("/:id").get(getUser);

// Route to update the user's profile
router.route("/profile").put(updateProfile);

// Route to follow a user by ID
router.route("/:id/follow").put(followUser);

export default router;
