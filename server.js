import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import { notFound, errorHandler } from "./middleware/ErrorMiddleware.js";

// ROUTES
import PostRoutes from "./routes/PostRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import CommentRoutes from "./routes/CommentRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";

const app = express();
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());
// You can configure CORS as needed.

// Route
app.use("/api/v1/posts", PostRoutes);
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/comments", CommentRoutes);
app.use("/api/v1/users", UserRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
