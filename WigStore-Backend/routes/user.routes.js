const express = require('express');
const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  uploadProfileImage, 
  getProfile,
  updateProfile,
  updateUserById,
  deleteAccount
} = require('../controllers/user.controller');
const { uploadUserImage } = require('../middleware/uploadMiddleware');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/upload-avatar', protect, uploadUserImage.single('image'), uploadProfileImage);

// New routes for user management
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteAccount);

// Admin routes for user management
router.put('/:id', protect, adminOnly, updateUserById);

module.exports = router;