import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import asyncHandler from "express-async-handler";

export const getCommentsForPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId; // Assuming you get the post ID from the URL
  const comments = await Comment.find({ post: postId }).populate(
    "user",
    "username"
  );

  res.status(200).json({ status: "success", data: comments });
});

export const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId; // Assuming you get the post ID from the URL
  const userId = req.user.id; // Assuming you have authentication middleware

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

  res.status(201).json({ status: "success", data: newComment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id; // Assuming you get the comment ID from the URL
  const userId = req.user.id; // Assuming you have authentication middleware

  const comment = await Comment.findById(commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  if (comment.user.toString() !== userId) {
    res.status(403);
    throw new Error("You are not authorized to delete this comment");
  }

  await comment.remove();

  res
    .status(204)
    .json({ status: "success", message: "Comment deleted successfully" });
});

export const likeComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId; // Assuming you get the comment ID from the URL
  const userId = req.user.id; // Assuming you have authentication middleware

  const comment = await Comment.findById(commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // Check if the user has already liked the comment
  if (comment.likes.includes(userId)) {
    res.status(400);
    throw new Error("You have already liked this comment");
  }

  comment.likes.push(userId);
  await comment.save();

  res
    .status(200)
    .json({ status: "success", message: "You have liked the comment" });
});

export const unlikeComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId; // Assuming you get the comment ID from the URL
  const userId = req.user.id; // Assuming you have authentication middleware

  const comment = await Comment.findById(commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // Check if the user has not liked the comment
  if (!comment.likes.includes(userId)) {
    res.status(400);
    throw new Error("You have not liked this comment");
  }

  // Remove the user's ID from the likes array
  comment.likes = comment.likes.filter((like) => like.toString() !== userId);

  await comment.save();

  res
    .status(200)
    .json({ status: "success", message: "You have unliked the comment" });
});
