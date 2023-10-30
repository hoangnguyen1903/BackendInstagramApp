import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const register = asyncHandler(async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create a new user
  const user = new User({ userName, fullName, email, password });

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  // Generate and send a JSON Web Token (JWT)
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(201).json({ status: "success", token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Check if the provided password matches the stored hash
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Generate and send a JSON Web Token (JWT)
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({ status: "success", token });
});

export const getProfile = asyncHandler(async (req, res) => {
  // User data is available through authentication middleware
  res.status(200).json({ status: "success", data: req.user });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if the provided current password matches the stored hash
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  // Hash and update the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  res
    .status(200)
    .json({ status: "success", message: "Password updated successfully" });
});
