const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const videoSchema = new Schema({
    type: { type: String, required: true }, 
    videoUrl: { type: String, required: true }, 
    Image: { type: String, required: true }, 
    title: { type: String, required: true }, 
    description: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }
});

const Video = model("Video", videoSchema);

module.exports = Video;
