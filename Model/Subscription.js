const mongoose = require("mongoose");


const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: String, default: "free" },
  price: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema); 