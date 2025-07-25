const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true }, // Phone number with country code
  isAdmin: { type: Boolean, default: false }, // Admin protection field
  blocked: { type: Boolean, default: false }, // Blocked user field
  online: { type: Boolean, default: false } // Online status field
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
