const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  balance: { type: Number, default: 15000 }
});

const User = mongoose.model('User', userSchema);

module.exports = User;