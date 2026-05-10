const accountService = require("../models/account");

// Create account
const createAccount = async (req, res, next) => {
  try {
    const account = await accountService.createAccount(req.user.id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

// Get logged-in user's account
const getAccount = async (req, res, next) => {
  try {
    const account = await accountService.getAccountByUser(req.user.id);

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

// Get balance only
const getBalance = async (req, res, next) => {
  try {
    const balance = await accountService.getBalance(req.user.id);

    res.status(200).json({
      success: true,
      balance,
    });
  } catch (err) {
    next(err);
  }
};

// Get account by account number (used for transfers)
const getAccountByNumber = async (req, res, next) => {
  try {
    const { accountNumber } = req.params;

    const account = await accountService.getAccountByNumber(accountNumber);

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAccount,
  getAccount,
  getBalance,
  getAccountByNumber,
};