const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createShippingLocation,
  getShippingLocations,
  updateShippingLocation,
  deleteShippingLocation
} = require('../controllers/shippingController');

router.route('/')
  .get(getShippingLocations)
  .post(protect, admin, createShippingLocation);

router.route('/:id')
  .put(protect, admin, updateShippingLocation)
  .delete(protect, admin, deleteShippingLocation);

module.exports = router;
