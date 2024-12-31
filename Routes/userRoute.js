const express = require('express');
// const signup = require("../Controller/Auth")
const controller=require('../Controller/Auth')
const router = express()

// Route for user signup
router.post('/Signup', controller.signup);
router.post('/Login',controller.login);


module.exports = router;
// const express=require('express')
// const {signup}=require('../Controller/Auth')
// const userRoutes=express.Router()

// userRoutes.post('/Signup',signup);

// // userRoutes.post('/Login',(req,res)=>{
// //     res.send('signupRoute')
// // })

// // userRoutes.post('/Logout',(req,res)=>{
// //     res.send("Logout Route")
// // })

// module.exports = userRoutes


