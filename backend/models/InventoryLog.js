const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  changeType: {
    type: String,
    enum: ['Restock', 'Order Placed', 'Order Cancelled', 'Order Refunded', 'Manual Adjustment'],
    required: true,
  },
  previousStock: {
    type: Number,
    required: true,
  },
  newStock: {
    type: Number,
    required: true,
  },
  quantityChanged: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
  },
  orderId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
