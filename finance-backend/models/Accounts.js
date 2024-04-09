const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema(
  {
    item_id: {
      type: String,
      required: true,
    },
    plaid_account_id: { type: String, required: true, unique: true },
    institution_name: String,
    account_name: { type: String, required: true },
    account_type: { type: String, required: true },
    account_subtype: { type: String, required: true },
    available_balance: { type: Number, default: 0 },
    current_balance: { type: Number, required: true },
    iso_currency_code: { type: String, required: true },
    limit: { type: Number },
    mask: String,
    official_name: String,
  },
  { timestamps: true },
);

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
