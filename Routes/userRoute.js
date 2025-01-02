const express = require('express');
const controller=require('../Controller/userSide')
const router = express()

router.post('/user/Signup', controller.signup);
router.post('/user/Login',controller.login);
router.post('/user/addToWatchList',controller.addToWatchList)
router.get('/user/getWatchList/:userId',controller.getWatchList)
router.delete('/user/deleteVideo/:userId/:videoId',controller.deleteVideoFromWatchList)

module.exports = router;