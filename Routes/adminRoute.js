const express = require('express');
const adminController=require('../Controller/adminSide');
const upload = require('../Middleware/Cloudinary');
const router = express.Router()

router.post('/admin/uploadVideo',upload,adminController.uploadController)
router.get('/admin/getVideos',adminController.getEntairVideos)
router.get('/admin/getVideoById/:videoId',adminController.getVideoById)
router.put('/admin/updateVideo/:videoId',adminController.updateVideoById)
router.delete('/admin/deleteVideo/:videoId',adminController.deleteVideo)

module.exports= router
