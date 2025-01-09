require('dotenv').config()
const express=require('express')
const mongoose =require("mongoose")
const userRoute=require('./Routes/userRoute')
const adminRoute=require('./Routes/adminRoute')
const cors=require("cors")
const app=express()
port=3001
// import userRoute from './Routes/userRoute'
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
      origin: "http://localhost:3000", // Allow requests from this origin
      credentials: true, // Allow cookies/credentials
      methods: "GET, POST, PUT, PATCH, DELETE", // Allow specific HTTP methods
    })
  );
  app.use('/api',userRoute);
  app.use('/api',adminRoute);

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("connected to database"))
.catch((err)=>console.log(err))

app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
})