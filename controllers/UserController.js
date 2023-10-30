import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  let users = await User.find({});

  res.status(201).json({ status: "success", count: users.length, data: users });
});

export const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(201).json({ status: "success", data: user });
});

export const followUser = asyncHandler(async (req, res) => {
  // console.log(req.user);
  const loggedInUserId = req.user.id; // Assuming you have authentication middleware

  // Find the user you want to follow by their ID
  const userToFollow = await User.findById(req.params.id);

  if (!userToFollow) {
    res.status(404);
    throw new Error("User not found");
  } else {
    // Check if the logged-in user is already following the target user
    if (userToFollow.followers.includes(loggedInUserId)) {
      res.status(400);
      throw new Error("You are already following this user");
    } else {
      // Add the logged-in user's ID to the target user's followers array
      userToFollow.followers.push(loggedInUserId);
      await userToFollow.save();

      // Update the logged-in user's following list
      const loggedInUser = await User.findById(loggedInUserId);
      loggedInUser.following.push(userToFollow._id);
      await loggedInUser.save();

      res.status(201).json({
        status: "success",
        message: "You are now following this user",
      });
    }
  }
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Assuming you have authentication middleware

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Update user profile fields based on the request body
    if (req.body.userName) user.userName = req.body.userName;
    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.email) user.email = req.body.email;
    if (req.body.avatarUrl) user.avatarUrl = req.body.avatarUrl;

    // Handle profile picture upload (assuming you handle it using a file upload library)
    // if (req.file) {
    //   // Save the profile picture file and update the user's profilePicture field
    //   user.avatarUrl = req.file.path;
    // }

    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Profile updated successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("An error occurred while updating the profile");
  }
});

// export const uploadFile = asyncHandler(async (req, res) => {
//   // 'profilePicture' should match the name attribute in your HTML form

//   if (!req.file) {
//     res.status(400);
//     throw new Error("No file uploaded");
//   }

//   // Handle the uploaded file here, e.g., save the file path in the user's profile
//   const filePath = req.file.path;

//   // You can then update the user's profile with the file path
//   // Example: req.user.profilePicture = filePath;

//   return res.status(200).json({
//     status: "success",
//     message: "File uploaded successfully",
//     path: filePath,
//   });
// });
