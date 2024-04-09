const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  plaid_transaction_id: String,
  plaid_account_id: String,
  iso_currency_code: String,
  category: [String],
  amount: Number,
  date: Date,
  name: String,
  merchant_name: String,
  pending: Boolean,
});

const TransactionModel = mongoose.model('transaction', TransactionSchema);
module.exports = TransactionModel;
