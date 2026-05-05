const mongoose = require('mongoose');
const User = require('../models/usermodel');
const Transaction = require('../models/transaction');

exports.transfer = async (req, res) => {
  const { toUserId, amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ msg: "Invalid amount" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await User.findById(req.user.id).session(session);
    const receiver = await User.findById(toUserId).session(session);

    if (!receiver) {
      throw new Error("Receiver not found");
    }

    if (sender._id.toString() === receiver._id.toString()) {
      throw new Error("Cannot transfer to yourself");
    }

    if (sender.balance < amount) {
      throw new Error("Insufficient funds");
    }

    // 💸 Debit sender
    sender.balance -= amount;
    await sender.save({ session });

    // 💰 Credit receiver
    receiver.balance += amount;
    await receiver.save({ session });

    // 🧾 Record transaction
    await Transaction.create([{
      sender: sender._id,
      receiver: receiver._id,
      amount,
      type: 'transfer',
      status: 'success'
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ msg: "Transfer successful" });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ $or: [{ sender: req.user.id }, { receiver: req.user.id }] })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const emailSender = require("../middleware/emailSender");

const sendTransactionAlert = async (user, transaction) => {
  const html = htmltemplate({
    customerName: user.name,
    type: transaction.type,
    amount: transaction.amount,
    currency: "₦",
    dateTime: new Date().toLocaleString(),
    reference: transaction.reference,
    accountNumber: `****${user.accountNumber.slice(-4)}`,
    description: transaction.description,
    balance: transaction.balance,
  });

  await sendEmail({
    to: user.email,
    subject: "Transaction Alert",
    html,
  });
};

module.exports = { sendTransactionAlert };

exports.deposit = async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.user.id);
  user.balance += amount;

  await user.save();

  res.json({ balance: user.balance });
};

exports.withdraw = async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.user.id);

  if (user.balance < amount) {
    return res.status(400).json({ msg: "Insufficient funds" });
  }

  user.balance -= amount;
  await user.save();

  res.json({ balance: user.balance });
};