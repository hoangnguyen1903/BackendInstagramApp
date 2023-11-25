import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const register = asyncHandler(async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  let user = new User({ userName, fullName, email, password });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  user = await User.findOne({ email })
    .select("-password")
    .populate({
      path: "following",
      model: "User",
      select: "userName fullName avatarUrl",
    })
    .populate({
      path: "followers",
      model: "User",
      select: "userName fullName avatarUrl",
    })
    .populate({
      path: "posts",
      model: "Post",
      select: "imageUrl",
    });

  res.status(201).json({ status: "success", data: { user, token } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  user = await User.findOne({ email })
    .select("-password")
    .populate({
      path: "following",
      model: "User",
      select: "userName fullName avatarUrl",
    })
    .populate({
      path: "followers",
      model: "User",
      select: "userName fullName avatarUrl",
    })
    .populate({
      path: "posts",
      model: "Post",
      select: "imageUrl",
    });

  res.status(200).json({ status: "success", data: { user, token } });
});
