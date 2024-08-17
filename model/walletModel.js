

const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  walletBalance: { type: Number, default: 0 },
  transactions: [
    {
      amount: { type: Number, required: true },
      description: { type: String, required: true },
      type: { type: String, enum: ['Refund', 'Credit', 'Debit'], required: true },
      transactionDate: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Wallet', walletSchema);
