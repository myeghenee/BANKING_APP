const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const { getUser, updateUser, deleteUser, deposit, withdraw, transferFunds } = require('../controllers/userController');

router.use(protect);

router.get('/user', protect, getUser);
router.get('/balance', protect, getBalance);
router.put('/update', protect, updateUser);
router.delete('/delete', protect, deleteUser);
router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/transfer', protect, transferFunds);

module.exports = router;

