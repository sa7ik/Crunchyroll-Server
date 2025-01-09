const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
         api_secret: process.env.CLOUDINARY_API_SECRET,
     })

// Define storage for video files
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'media/videos',  // Cloudinary folder for videos
        resource_type: 'video',  // Cloudinary resource type for videos
        allowed_formats: ['mp4', 'mkv', 'avi'],  // Allowed video formats
    },
});

// Define storage for image files
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'media/images',  // Cloudinary folder for images
        resource_type: 'image',  // Cloudinary resource type for images
        allowed_formats: ['png', 'jpg', 'jpeg'],  // Allowed image formats
    },
});

// Configure multer with Cloudinary storage for multiple fields (video and image)
const upload = multer({
    storage: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            if (file.fieldname === 'videoFile') {
                return {
                    folder: 'media/videos',
                    resource_type: 'video',  // Cloudinary resource type for videos
                    allowed_formats: ['mp4', 'mkv', 'avi'],
                };
            }
            if (file.fieldname === 'imageFile') {
                return {
                    folder: 'media/images',
                    resource_type: 'image',  // Cloudinary resource type for images
                    allowed_formats: ['png', 'jpg', 'jpeg'],
                };
            }
        },
    }),
}).fields([
    { name: 'videoFile', maxCount: 1 },  // For video file
    { name: 'imageFile', maxCount: 1 },  // For image file
]);

module.exports = upload;