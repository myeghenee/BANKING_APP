const express = require("express");
const router = express.Router();

const authController = require("../controllers/usercontroller");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Change password (logged in user)
router.put("/change-password", authController.changePassword);

// Forgot password
router.post("/forgot-password", authController.forgotPassword);

// Reset password
router.post("/reset-password", authController.resetPassword);

module.exports = router;