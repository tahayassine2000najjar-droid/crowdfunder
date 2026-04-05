const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String,minLength: [6,'Password must be at least 6 characters long'],required: true },
  role: { type: String, enum: ['owner', 'investor', 'admin'], required: true },
  balance: { type: Number, default: 0 } 
});
module.exports = mongoose.model('User', userSchema);