const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadProductImages } = require('../controllers/uploadController');
const { uploadProductImages: uploadProductImagesMiddleware } = require('../middleware/uploadMiddleware');

router.post(
  '/images',
  protect,
  admin,
  uploadProductImagesMiddleware.array('images', 10),
  uploadProductImages
);

module.exports = router;
