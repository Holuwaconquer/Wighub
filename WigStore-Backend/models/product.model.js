// models/productModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  review: DataTypes.TEXT,
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  images: {
  type: DataTypes.TEXT, // Store JSON array of Cloudinary URLs
  get() {
    const raw = this.getDataValue('images');
    return raw ? JSON.parse(raw) : [];
  },
  set(value) {
    this.setDataValue('images', JSON.stringify(value));
  },
},
});

module.exports = Product;
