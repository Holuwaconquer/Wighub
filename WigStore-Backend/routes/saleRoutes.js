const express = require("express");
const router = express.Router();
const {
  getSales,
  getActiveSalesProducts,
  createSale,
  updateSale,
  deleteSale,
} = require("../controllers/saleController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", getSales);
router.get("/active-products", getActiveSalesProducts);
router.post("/", protect, admin, createSale);
router.put("/:id", protect, admin, updateSale);
router.delete("/:id", protect, admin, deleteSale);

module.exports = router;
