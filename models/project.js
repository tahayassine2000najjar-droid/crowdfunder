const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  goalCapital: Number,
  currentCapital: { type: Number, default: 0 },
  maxInvestPerPerson: { type: Number, default: 50 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Project', projectSchema);