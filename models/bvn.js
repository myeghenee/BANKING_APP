// models/Bvn.js
const mongoose = require ('mongoose');

const bvnSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    bvnNumber: {
      type: String,
      required: true,
      unique: true
    },

    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    dateOfBirth: {
      type: Date,
      required: true
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true
    },

    phoneNumber: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    address: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Bvn = mongoose.model("Bvn", bvnSchema);

module.exports = { Bvn };