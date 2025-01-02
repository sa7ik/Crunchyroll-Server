const express = require('express');
const adminController=require('../Controller/adminSide')
const router = express.Router()
const {upload}=require('../Middleware/Cloudinary')

router.post('/admin/uploadVideo',upload.single("video"),adminController.uploadVideoToCloudinary)
router.get('/admin/getVideos',adminController.getEntairVideos)
router.get('/admin/getVideoById/:videoId',adminController.getVideoById)
router.put('/admin/updateVideo/:videoId',adminController.updateVideoById)
router.delete('/admin/deleteVideo/:videoId',adminController.deleteVideo)

module.exports= router