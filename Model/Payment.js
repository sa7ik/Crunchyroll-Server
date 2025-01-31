
const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number, 
    required: false,
  },
  date: {
    type: Date, 
    default: Date.now, 
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String, 
    enum: ['Completed', 'Pending', 'Failed'],
    default: 'Pending', 
  },
  transactionId: {
    type: String,
    required: true,
  },
});


module.exports= mongoose.model("Payment", paymentSchema);
