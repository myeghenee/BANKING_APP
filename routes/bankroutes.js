//api bankroutes.js
const express = require('express');
const router = express.Router();
const { getBalance, transferFunds } = require('../controllers/bankController');
const protect = require('../middleware/authMiddleware');

router.get('/balance', protect, getBalance);


module.exports = router;