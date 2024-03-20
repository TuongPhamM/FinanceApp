const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  /*transaction info will be here*/
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plaid_transaction_id: String,
  account_id: String,
  amount: Number,
  date: Date,
  name: String,
  category: [String],
  pending: Boolean,

  // Add other fields as needed
});

const TransactiontModel = mongoose.model('transaction', TransactionSchema);
module.exports = TransactiontModel;
