// const jwt=require('jsonwebtoken')
// const User=require('../Model/User')

// const userAuth=(async(req,res,next)=>{
//     const token=req.cookies
// // console.log(token);

//     if (!token){
//         return res.status(401).json({
//             success:false,
//             message:'Unauthorized: token in missing'
//         })
//     }
//     const decoded=jwt.verify(token,process.env.jwt_secret)
//     const user=await User.findById(decoded.id)
//     if (!user){
//         return res.status(401).json({
//             success:false,
//             message:'User not found'
//         })
//     }
//     req.user=user
//     next()
// })
// module.exports={userAuth}

const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");

const tokenVerification = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.jwt_secret, (err, user) => {
        if (err) throw new CustomError("Token is not valid", 403);
        else {
          req.user = user;
          next();
        }
      });
    } else {
      throw new CustomError("You are not authenticated", 403);
    }
  } catch (error) {
    throw new CustomError(
      error.message || "Failed to verify authentication",
      500
    );
  }
};

module.exports = { tokenVerification };