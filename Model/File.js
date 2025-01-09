const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    type: { type: String, required: true }, 
    videoUrl: { type: String, required: true }, 
    Image: { type: String, required: true }, 
    title: { type: String, required: true }, 
    description: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model("File", FileSchema);
module.exports = File;
