// routes/order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// 🛍️ User creates order
router.post('/', protect, orderController.createOrder);

// 👤 User gets their own orders
router.get('/my-orders', protect, orderController.getUserOrders);

// 👁️ Get single order (user or admin)
router.get('/:id', protect, orderController.getOrderById);

// 🧑‍💼 Admin-only routes
router.get('/', protect, adminOnly, orderController.getAllOrders);
router.put('/:id/status', protect, adminOnly, orderController.updateOrderStatus);
router.delete('/:id', protect, adminOnly, orderController.deleteOrder);

module.exports = router;
