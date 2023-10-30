import express from "express";
import {
  getCommentsForPost,
  createComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from "../controllers/CommentController.js";
import { ProtectMiddleware } from "../middleware/ProtectMiddleware.js";

const router = express.Router({ mergeParams: true });

// Get comments for a specific post and create a new comment
router
  .route("/")
  .get(getCommentsForPost)
  .post(ProtectMiddleware, createComment);

// Delete a comment
router.route("/:id").delete(ProtectMiddleware, deleteComment);

// Like and unlike a comment
router.route("/:id/like").put(ProtectMiddleware, likeComment);

router.route("/:id/unlike").put(ProtectMiddleware, unlikeComment);

export default router;
