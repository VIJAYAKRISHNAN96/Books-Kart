
const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 300  // Document expires after 5 minutes
    }
}, {
    timestamps: true // Optional, for keeping track of creation and update times
});

module.exports = mongoose.model('Otp', otpSchema);
