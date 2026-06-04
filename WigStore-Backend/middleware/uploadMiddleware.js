const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// User avatar upload
const userStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wig-store/users',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const uploadUserImage = multer({ storage: userStorage });

// Category image upload
const categoryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wig-store/categories',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const uploadCategoryImage = multer({ storage: categoryStorage });

// Product image upload (multiple)
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wig-store/products',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const uploadProductImages = multer({ storage: productStorage });

module.exports = {
  uploadUserImage,
  uploadCategoryImage,
  uploadProductImages,
};
