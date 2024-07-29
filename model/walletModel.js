// const mongoose = require('mongoose');
// const objectID = mongoose.Schema.Types.ObjectId;

// const transactionSchema = new mongoose.Schema({
//   amount: Number,
//   description: String,
//   type: String,
//   transactionDate: {
//     type: Date,
//     default: Date.now,
//   }
// }, {
//   _id: false 
// });

// const walletSchema = mongoose.Schema({
//   user: {
//     type: objectID,
//     ref: 'User',
//     required: true
//   },
//   walletBalance: {
//     type: Number,
//     default: 0
//   },
//   amountSpent: {
//     type: Number,
//     default: 0
//   },
  
//   transactions: [transactionSchema], 
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Wallet', walletSchema);

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
