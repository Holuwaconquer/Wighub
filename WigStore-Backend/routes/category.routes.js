const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller.js');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadCategoryImage } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Admin-only routes
router.post('/', protect, adminOnly, uploadCategoryImage.single('image'), categoryController.createCategory);
router.put('/:id', protect, adminOnly, uploadCategoryImage.single('image'), categoryController.updateCategory);
router.delete('/:id', protect, adminOnly, categoryController.deleteCategory);

module.exports = router;
