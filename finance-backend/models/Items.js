const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  plaid_item_id: { type: String, required: true, unique: true },
  access_token: { type: String, required: true },
  cursor: { type: String },
  // Uncomment or add any additional fields as needed
});

const ItemModel = mongoose.model('Item', ItemSchema);
module.exports = ItemModel;
