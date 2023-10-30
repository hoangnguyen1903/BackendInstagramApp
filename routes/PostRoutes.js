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
import CommentRoutes from "./CommentRoutes.js";

const router = express.Router();

// Include CommentRoutes as a sub-route
router.use("/:postId/comments", CommentRoutes);

// Routes for Posts
router.route("/").get(getAllPosts).post(ProtectMiddleware, createPost);

router
  .route("/:id")
  .get(getPostById)
  .put(ProtectMiddleware, AuthMiddleware("user", "admin"), updatePost)
  .delete(ProtectMiddleware, AuthMiddleware("user", "admin"), deletePost);

// Routes for Liking and Unliking Posts
router.route("/:id/like").put(ProtectMiddleware, likePost);

router.route("/:id/unlike").put(ProtectMiddleware, unlikePost);

export default router;
