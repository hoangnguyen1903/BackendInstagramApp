import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate({
      path: "user",
      model: "User",
      select: "userName avatarUrl",
    })
    .populate({
      path: "likes",
      model: "User",
      select: "_id",
    })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        model: "User",
        select: "userName avatarUrl",
      },
    });

  res.status(200).json({ status: "success", data: posts });
});

export const getPostById = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId)
    .populate({
      path: "user",
      model: "User",
      select: "userName avatarUrl",
    })
    .populate({
      path: "likes",
      model: "User",
      select: "_id",
    })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        model: "User",
        select: "userName avatarUrl",
      },
    });

  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  res.status(200).json({ status: "success", data: post });
});

export const createPost = asyncHandler(async (req, res) => {
  const { caption, location, imageUrl } = req.body;
  const userId = req.user._id;

  const newPost = new Post({
    caption,
    location,
    imageUrl,
    user: userId,
  });

  await newPost.save();

  const user = await User.findById(userId);
  user.posts.push(newPost._id);

  await user.save();

  const post = await Post.findById(newPost._id)
    .populate({
      path: "user",
      model: "User",
      select: "userName avatarUrl",
    })
    .populate({
      path: "likes",
      model: "User",
      select: "_id",
    })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        model: "User",
        select: "userName avatarUrl",
      },
    });

  res.status(201).json({ status: "success", data: post });
});

export const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { caption, location, imageUrl } = req.body;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  if (post.user.toString() !== userId) {
    return res.status(403).json({
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
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  if (post.user.toString() !== userId.toString()) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to delete this post",
    });
  }

  await post.remove();
  res.status(201).json({ status: "success", data: postId });
});

export const likePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

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
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  if (!post.likes.includes(userId)) {
    return res
      .status(400)
      .json({ status: "error", message: "You have not liked this post" });
  }

  post.likes = post.likes.filter(
    (like) => like.toString() !== userId.toString()
  );

  await post.save();

  res
    .status(200)
    .json({ status: "success", message: "You have unliked the post" });
});
