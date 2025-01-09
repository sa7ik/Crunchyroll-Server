const fs = require('fs')
const { uploadFiles } = require('../Middleware/Cloudinary')
const Video = require('../Model/Video');
const File = require('../Model/File')

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
    const fileData = new File({
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

    // Update the video by its ID
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { title, description },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(updatedVideo);
  } catch (error) {
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
  uploadController,
  getEntairVideos,
  getVideoById,
  updateVideoById,
  deleteVideo
};
