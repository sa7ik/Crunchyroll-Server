const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const videoSchema = new Schema({
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  profil: { type: String },
  likes: [{ type: String }],
  dislikes: [{ type: String }],
  userName: { type: String },
  title: { type: String, required: true },

});

const Video = model("Video", videoSchema);

module.exports = Video;
