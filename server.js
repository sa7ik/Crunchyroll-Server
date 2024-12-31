require('dotenv').config()
const express=require('express')
const mongoose =require("mongoose")
const userRoute=require('./Routes/userRoute')
const cors=require("cors")
const app=express()
port=3001
// import userRoute from './Routes/userRoute'

app.use(cors({origin:"http://localhost:3000",credentials:true}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api',userRoute);

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("connected to database"))
.catch((err)=>console.log(err))

app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
})