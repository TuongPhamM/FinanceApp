const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  plaid_item_id: { type: String, required: true, unique: true },
  access_token: { type: String, required: true },
  cursor: { type: String },
});

const ItemModel = mongoose.model('Item', ItemSchema);
module.exports = ItemModel;
