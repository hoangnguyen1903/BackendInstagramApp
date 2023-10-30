import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content is not empty"],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Use a function to set the current date
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
