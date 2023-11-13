import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from "../controllers/PostController.js";

import {
  ProtectMiddleware,
  AuthMiddleware,
} from "../middleware/ProtectMiddleware.js";

import CommentRouter from "./CommentRoutes.js";

const router = express.Router();

// Comment
router.use("/:postId/comments", CommentRouter);

// Post
router.route("/").get(getAllPosts).post(ProtectMiddleware, createPost);

router
  .route("/:id")
  .get(getPostById)
  .put(ProtectMiddleware, AuthMiddleware("user", "admin"), updatePost)
  .delete(ProtectMiddleware, AuthMiddleware("user", "admin"), deletePost);

router.route("/:id/like").put(ProtectMiddleware, likePost);

router.route("/:id/unlike").put(ProtectMiddleware, unlikePost);

export default router;
