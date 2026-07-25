const mongoose = require("mongoose");

const shippingLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  fee: {
    type: Number,
    required: true,
    default: 0,
  },
  estimatedDays: {
    type: String,
    trim: true,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ShippingLocation", shippingLocationSchema);
