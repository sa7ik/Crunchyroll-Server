const fs = require('fs')
const { uploadFiles } = require('../Middleware/Cloudinary')
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const Video = require('../Model/Video');

const adminLogin = async (req, res, next) => {
  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    // Check if the provided email and password match the admin credentials
    if (
      req.body.email === ADMIN_EMAIL &&
      req.body.password === ADMIN_PASSWORD
    ) {
      console.log("Admin logged in");

      // Generate a JWT token for the admin
      const token = jwt.sign(
        {
          id: "admin",
          isAdmin: true,
        },
        process.env.jwt_secret,
        {
          expiresIn: "1d", // Token valid for 1 day
        }
      );

      // Set the token as an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return res.status(200).json({ token, isAdmin: true });
    }

    // If credentials don't match, return an error
    throw new CustomError("Invalid email or password", 401);
  } catch (error) {
    // Pass error to the error-handling middleware
    next(error);
  }
};

const uploadController = async (req, res) => {
  try {
    // Extract file paths from req.files
    const videoUrl = req.files?.videoFile?.[0]?.path;
    const imageUrl = req.files?.imageFile?.[0]?.path;

    // Extract title and description from req.body
    const { title, description } = req.body;

    // Log uploaded files and form data for debugging
    console.log('Uploaded files:', req.files);
    console.log('Title:', title);
    console.log('Description:', description);

    // Validate required fields
    if (!videoUrl || !imageUrl || !title || !description) {
      return res.status(400).json({
        message: "Video, image, title, and description are all required.",
      });
    }

    // Create a new document with the extracted data
    const fileData = new Video({
      type: "video",
      videoUrl,       // Cloudinary video URL
      Image: imageUrl, // Cloudinary image URL
      title,          // Title from the request body
      description,    // Description from the request body
    });

    // Save the document to the database
    await fileData.save();

    // Respond with success
    res.status(200).json({
      message: "Files uploaded and saved successfully.",
      fileData,
    });
  } catch (error) {
    // Log error and respond with error message
    console.error("Error uploading files:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getEntairVideos = async (req, res) => {
  try {
    // Fetch all videos and populate the userId and channelId references
    const videos = await Video.find()
    
    // Send the videos as a response
    res.status(200).json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error.message);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

const getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Find the video by ID and populate the userId and channelId references
    const video = await Video.findById(videoId)

    res.status(200).json(video);
  } catch (error) {
    console.error("Error fetching one video:", error.message);
    res.status(500).json({ error: error.message || "Failed to fetch video" });
  }
};

const updateVideoById = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { videoId } = req.params;
    console.log("  ffgf",req.files);
    // Check if the video exists
    const existingVideo = await Video.findById(videoId);
    if (!existingVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Prepare the update object
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;

    // Handle new video file upload
    if (req.files) {
      const videoFile = req.files. videoFile[0];
      
      
      updates.videoUrl = videoFile.path; // Assuming Cloudinary or similar storage
    }

    // Handle new image file upload
    if (req.files) {
      const imageFile = req.files.imageFile[0];
      updates.Image = imageFile.path; // Assuming Cloudinary or similar storage
    }

    // Update the video document in the database
    const updatedVideo = await Video.findByIdAndUpdate(videoId, updates, { new: true });

    res.status(200).json({
      message: "Video updated successfully",
      updatedVideo,
    });
  } catch (error) {
    console.error("Error updating video:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteVideo = async (req, res, next) => {
  const { videoId } = req.params
  const deleteVideo = await Video.findByIdAndDelete(videoId)
  if (!deleteVideo) {
    return next(new CustomError('video not found', 400))
  }
  res.status(200).json({ data: deleteVideo, message: "video deleted successfully" })
}

module.exports = {
  adminLogin,
  uploadController,
  getEntairVideos,
  getVideoById,
  updateVideoById,
  deleteVideo
};
