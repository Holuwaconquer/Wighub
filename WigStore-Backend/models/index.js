// models/index.js
const sequelize = require('../config/db');

const User = require('./user.model');
const Category = require('./category.model');
const Product = require('./product.model');
const Order = require('./order.model.js');
const OrderItem = require('./orderItem.model.js');

// associations - FIXED: consistent lowercase
Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
};