// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const {
  createAdmin,
  loginAdmin,
  getAllUsers,
} = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// 🧍 Create a new admin (only an existing admin can do this)
router.post('/create', protect, adminOnly, createAdmin);

// 🔑 Admin login
router.post('/login', loginAdmin);

// 👥 Get all users (admin only)
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
