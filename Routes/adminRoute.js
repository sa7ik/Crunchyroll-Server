const express = require('express');
const adminController=require('../Controller/adminSide');
const upload = require('../Middleware/Cloudinary');
const {adminAuth}=require("../Middleware/adminAuth")
const router = express.Router()

router.post('/admin/adminLogin',adminController.adminLogin)
router.post('/admin/uploadVideo',upload,adminController.uploadController)
router.get('/admin/getVideos',adminController.getEntairVideos)
router.get('/admin/getVideoById/:videoId',adminAuth,adminController.getVideoById)
router.put('/admin/updateVideo/:videoId',upload,adminController.updateVideoById)
router.delete('/admin/deleteVideo/:videoId',adminController.deleteVideo)

module.exports= router
