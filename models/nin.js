// NIN Model
const mongoose = require('mongoose');

const ninSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    ninNumber: {
        type: String,
        required: true,
        unique: true
    }
});

const NIN = mongoose.model('NIN', ninSchema);

module.exports = NIN;