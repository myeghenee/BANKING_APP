const express = require("express");
const router = express.Router();

const accountController = require("../controllers/accountcontroller");

const authMiddleware = require("../middleware/authmiddleware");

// Create account
router.post("/", authMiddleware, accountController.createAccount);

// Get account details
router.get("/", authMiddleware, accountController.getAccount);

// Get account balance
router.get("/balance", authMiddleware, accountController.getBalance);

// Get account by number (for transfers)
router.get("/:accountNumber", authMiddleware, accountController.getAccountByNumber);

module.exports = router;