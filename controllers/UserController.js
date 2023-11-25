import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const getAllUsers = asyncHandler(async (req, res) => {
  let users = await User.find({}).select("-password");

  res.status(201).json({ status: "success", data: users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId)
    .select("-password")
    .populate("posts", "imageUrl");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(201).json({ status: "success", data: user });
});

export const followUser = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;

  const userToFollow = await User.findById(req.params.id);

  if (!userToFollow) {
    res.status(404);
    throw new Error("User not found");
  } else {
    if (userToFollow.followers.includes(loggedInUserId)) {
      res.status(400);
      throw new Error("You are already following this user");
    } else {
      userToFollow.followers.push(loggedInUserId);
      await userToFollow.save();

      let loggedInUser = await User.findById(loggedInUserId);
      loggedInUser.following.push(userToFollow._id);
      await loggedInUser.save();

      loggedInUser = await User.findById(loggedInUserId)
        .select("-password")
        .populate({
          path: "following",
          model: "User",
          select: "userName avatarUrl",
        })
        .populate({
          path: "followers",
          model: "User",
          select: "userName avatarUrl",
        });

      res.status(201).json({
        status: "success",
        data: loggedInUser,
      });
    }
  }
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const userToUnfollowId = req.params.id;

  const currentUserId = req.user._id;

  const userToUnfollow = await User.findById(userToUnfollowId);
  if (!userToUnfollow) {
    res.status(404);
    throw new Error("User to unfollow not found");
  }

  if (!userToUnfollow.followers.includes(currentUserId)) {
    res.status(400);
    throw new Error("You are not following this user");
  }

  userToUnfollow.followers = userToUnfollow.followers.filter(
    (followerId) => followerId.toString() !== currentUserId.toString()
  );

  let currentUser = await User.findById(currentUserId);
  currentUser.following = currentUser.following.filter(
    (followingId) => followingId.toString() !== userToUnfollowId.toString()
  );

  await userToUnfollow.save();
  await currentUser.save();

  currentUser = await User.findById(currentUserId)
    .select("-password")
    .populate({
      path: "following",
      model: "User",
      select: "userName avatarUrl",
    })
    .populate({
      path: "followers",
      model: "User",
      select: "userName avatarUrl",
    });

  res.status(200).json({ status: "success", data: currentUser });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (req.body.userName) user.userName = req.body.userName;
    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.email) user.email = req.body.email;
    if (req.body.avatarUrl) user.avatarUrl = req.body.avatarUrl;

    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res.status(500);
    throw new Error("An error occurred while updating the profile");
  }
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  res
    .status(200)
    .json({ status: "success", message: "Update password successfully" });
});
