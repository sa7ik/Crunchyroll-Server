const express = require('express');
const router = express()
const controller=require('../Controller/userSide')
const {tryCatch}=require("../utils/tryCatch")
// const {userAuth}=require('../Middleware/userAuth')
const {tokenVerification}=require('../Middleware/userAuth')

router.post('/user/Signup', controller.signup);
router.post('/user/Login',controller.login);
router.post('/user/create-payment-intent',controller.createPaymentIntent)
router.post('/user/verifypremium/:sessionId',controller.verifyPremium)
router.get('/user/getUsers',controller.getAllUsers)
router.get('/user/allVideo',controller.getEntairVideos)
router.get('/user/videoById/:videoId',controller.getVideoById)
router.post('/user/addToWatchList',controller.addToWatchList)
router.get('/user/getWatchList/:userId',controller.getWatchList)
router.delete('/user/deleteVideo/:userId/:videoId',controller.deleteVideoFromWatchList)

module.exports = router;