import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";

export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("user", "username")
    .populate("likes", "username")
    .populate({
      path: "postComments",
      model: "Comment",
      select: "text user",
      populate: {
        path: "user",
        model: "User",
        select: "username",
      },
    });

  res.status(200).json({ status: "success", data: posts });
});

export const getPostById = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId)
    .populate("user", "username")
    .populate("likes", "username")
    .populate({
      path: "postComments",
      model: "Comment",
      select: "text user",
      populate: {
        path: "user",
        model: "User",
        select: "username",
      },
    });

  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  res.status(200).json({ status: "success", data: post });
});

export const createPost = asyncHandler(async (req, res) => {
  const { caption, location, imageUrl } = req.body;
  const userId = req.user.id; // Assuming you have authentication middleware

  const newPost = new Post({
    caption,
    location,
    imageUrl,
    user: userId,
  });

  await newPost.save();

  res.status(201).json({ status: "success", data: newPost });
});

export const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { caption, location, imageUrl } = req.body;
  const userId = req.user.id; // Assuming you have authentication middleware

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  if (post.user.toString() !== userId) {
    return res
      .status(403)
      .json({
        status: "error",
        message: "You are not authorized to update this post",
      });
  }

  post.caption = caption;
  post.location = location;
  post.imageUrl = imageUrl;
  await post.save();

  res.status(200).json({ status: "success", data: post });
});

export const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id; // Assuming you have authentication middleware

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  if (post.user.toString() !== userId) {
    return res
      .status(403)
      .json({
        status: "error",
        message: "You are not authorized to delete this post",
      });
  }

  await post.remove();

  res
    .status(204)
    .json({ status: "success", message: "Post deleted successfully" });
});

export const likePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id; // Assuming you have authentication middleware

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  // Check if the user has already liked the post
  if (post.likes.includes(userId)) {
    return res
      .status(400)
      .json({ status: "error", message: "You have already liked this post" });
  }

  post.likes.push(userId);
  await post.save();

  res
    .status(200)
    .json({ status: "success", message: "You have liked the post" });
});

export const unlikePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id; // Assuming you have authentication middleware

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  // Check if the user has not liked the post
  if (!post.likes.includes(userId)) {
    return res
      .status(400)
      .json({ status: "error", message: "You have not liked this post" });
  }

  // Remove the user's ID from the likes array
  post.likes = post.likes.filter((like) => like.toString() !== userId);

  await post.save();

  res
    .status(200)
    .json({ status: "success", message: "You have unliked the post" });
});
