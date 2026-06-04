const express = require("express");
const router = express.Router();
const {
  initializePayment,
  verifyPayment,
  handleWebhook,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// Protected routes (require authentication)
router.post("/initialize", protect, initializePayment);
router.post("/verify", protect, verifyPayment);

// Webhook route (public - no authentication required)
router.post("/webhook", handleWebhook);

module.exports = router;
