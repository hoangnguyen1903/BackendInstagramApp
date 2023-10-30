import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    caption: {
      type: String,
      required: [true, "Caption is not empty"],
    },
    location: {
      type: String,
      required: [true, "Location is not empty"],
    },
    imageUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1617975251517-b90ff061b52e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      required: [true, "Please add a photo"],
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now()),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PostSchema.virtual("postComments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
