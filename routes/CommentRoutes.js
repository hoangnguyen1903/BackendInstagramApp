import express from "express";
import {
  createComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from "../controllers/CommentController.js";

import { ProtectMiddleware } from "../middleware/ProtectMiddleware.js";

const router = express.Router({ mergeParams: true });

// Comment
router.route("/").post(ProtectMiddleware, createComment);

router.route("/:id").delete(ProtectMiddleware, deleteComment);

router.route("/:id/like").put(ProtectMiddleware, likeComment);

router.route("/:id/unlike").put(ProtectMiddleware, unlikeComment);

export default router;
