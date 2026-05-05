const User = require('../models/usermodel');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: "Email already in use" });
  } 
  
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  res.json({ message: "Account is created", user });
};


// @desc   Get current logged-in user
// @route  GET /api/user/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// @desc   Get user balance
// @route  GET /api/user/balance
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// @desc   Update user profile
// @route  PUT /api/user/update
exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// @desc   Delete user account
// @route  DELETE /api/user/delete
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  // 🚫 Check if account is locked
  if (user.isLocked) {
    return res.status(403).json({
      msg: "Account locked. Try again later."
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  // ❌ Wrong password
  if (!isMatch) {
    user.loginAttempts += 1;

    // Lock account if max attempts reached
    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCK_TIME;
    }

    await user.save();

    return res.status(400).json({
      msg: "Invalid credentials",
      attemptsLeft: MAX_ATTEMPTS - user.loginAttempts
    });
  }

  // ✅ Successful login → reset attempts
  user.loginAttempts = 0;
  user.lockUntil = undefined;

  await user.save();

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};