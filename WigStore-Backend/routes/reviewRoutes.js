const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  getUserReviews,
  markHelpful,
  getAllReviews,
  approveReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/product/:productId', getProductReviews);

// User routes
router.get('/user', protect, getUserReviews);

// Protected routes
router.post('/', protect, createReview);
router.put('/:id/helpful', protect, markHelpful);

// Admin routes
router.get('/admin/all', protect, admin, getAllReviews);
router.put('/admin/:id/approve', protect, admin, approveReview);
router.delete('/admin/:id', protect, admin, deleteReview);

module.exports = router;