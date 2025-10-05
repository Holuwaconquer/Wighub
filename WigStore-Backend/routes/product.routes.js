const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadProductImages } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Admin-only routes
router.post('/', protect, adminOnly, uploadProductImages.array('images', 5), productController.createProduct);
router.put('/:id', protect, adminOnly, uploadProductImages.array('images', 5), productController.updateProduct);
router.delete('/:id', protect, adminOnly, productController.deleteProduct);

module.exports = router;
