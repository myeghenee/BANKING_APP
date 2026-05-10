const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactioncontroller");

const authMiddleware = require("../middleware/authmiddleware");

// Transfer money
router.post("/transfer", authMiddleware, transactionController.transfer);

// Deposit (optional: admin/system triggered)
router.post("/deposit", authMiddleware, transactionController.deposit);

// Withdraw
router.post("/withdraw", authMiddleware, transactionController.withdraw);

// Transaction history
router.get("/history", authMiddleware, transactionController.getTransactionHistory);

// Single transaction detail
router.get("/:reference", authMiddleware, transactionController.getTransactionByReference);

module.exports = router;