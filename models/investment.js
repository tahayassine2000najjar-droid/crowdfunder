const mongoose = require("mongoose");
const investmentSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  percentage: Number, 
  date: { type: Date, default: Date.now }
  
});
module.exports = mongoose.model('Investment', investmentSchema);