import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please enter your user name"],
    },
    avatarUrl: {
      type: String,
      default: "avatar_default.jpg",
    },
    fullName: {
      type: String,
      required: [true, "Please enter your full name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zAZ-]{2,}))$/,
        "Email is not valid",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.ObjectId, ref: "Post" }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

UserSchema.virtual("userPosts", {
  ref: "Post",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
