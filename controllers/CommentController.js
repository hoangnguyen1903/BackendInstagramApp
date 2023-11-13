import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import asyncHandler from "express-async-handler";

export const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const newComment = new Comment({
    content,
    post: postId,
    user: userId,
  });

  await newComment.save();
  post.comments.push(newComment._id);
  await post.save();

  const comment = await Comment.findById(newComment._id).populate({
    path: "user",
    model: "User",
    select: "userName avatarUrl",
  });

  res.status(201).json({ status: "success", data: comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user._id;
  const postId = req.params.postId;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (comment.user.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("You are not authorized to delete this comment");
  }
  post.comments = post.comments.filter((id) => id.toString() !== commentId);
  await post.save();
  await comment.remove();

  res.status(200).json({ status: "success", data: { postId, commentId } });
});

export const likeComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user._id;
  const postId = req.params.postId;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (comment.likes.includes(userId)) {
    res.status(400);
    throw new Error("You have already liked this comment");
  }

  comment.likes.push(userId);
  await comment.save();

  res
    .status(200)
    .json({ status: "success", data: { postId, commentId, userId } });
});

export const unlikeComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user._id;
  const postId = req.params.postId;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (!comment.likes.includes(userId)) {
    res.status(400);
    throw new Error("You have not liked this comment");
  }

  comment.likes = comment.likes.filter(
    (like) => like.toString() !== userId.toString()
  );

  await comment.save();

  res
    .status(200)
    .json({ status: "success", data: { postId, commentId, userId } });
});
