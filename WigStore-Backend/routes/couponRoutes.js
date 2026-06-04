const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route - no authentication needed
router.post('/validate', validateCoupon);

// Admin routes - require authentication
router.post('/', protect, admin, createCoupon);
router.get('/', protect, admin, getCoupons);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;