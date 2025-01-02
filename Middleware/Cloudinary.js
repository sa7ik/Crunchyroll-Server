const cloudinary = require("cloudinary").v2; // Ensure you're using Cloudinary's v2 API
const multer = require("multer");
require("dotenv").config();
const fs = require("fs");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer upload configuration using memory storage (better for Cloudinary uploads)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./Middleware/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
module.exports = { upload };


// Function to upload video to Cloudinary
const uploadVideo = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "video",
        });

        // Optionally delete the file from the local file system
        fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting file:", err);
        });

        return result; // Return the result of the upload
    } catch (error) {
        throw new Error("Error uploading video to Cloudinary: " + error.message);
    }
};

module.exports = { cloudinary, upload, uploadVideo };
