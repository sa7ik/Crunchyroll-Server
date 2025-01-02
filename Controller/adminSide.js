const fs=require('fs')
const {uploadVideo}=require('../Middleware/Cloudinary')
const Video=require('../Model/Video');

const uploadVideoToCloudinary = async (req, res) => {

  try {
    if (!req.file) {
      res.status(400).json({ message: "No video file uploaded" });
      return;
    }

    const { description, title} = req.body;

    if (!description) {
      res.status(400).json({ message: "Missing required fields: userId or description" });
      return;
    }

    const filePath = req.file.path;

    const result = await uploadVideo(filePath);

    // Delete the file from the local filesystem
    fs.unlinkSync(filePath);

    let video;
      video = new Video({
        description,
        videoUrl: result.secure_url,
        title,
      });
      await video.save();
   
    res.status(200).json({
      message: "Video uploaded and saved successfully",
      data: video,
    });
  } catch (error) {
    console.error("Error uploading video:", error.message);
    console.log(error);
    
    res.status(500).json({ message: "Internal server error", error: error.message });
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

  const deleteVideo=async(req,res,next)=>{
    const{videoId }=req.params
    const deleteVideo=await Video.findByIdAndDelete(videoId )
    if(!deleteVideo){
        return next(new CustomError('video not found',400))
    }
    res.status(200).json({data:deleteVideo,message:"video deleted successfully"})
}

module.exports = {
uploadVideoToCloudinary,
getEntairVideos,
getVideoById,
updateVideoById,
deleteVideo
};
