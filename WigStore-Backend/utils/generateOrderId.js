const crypto = require('crypto');

/**
 * Generate a unique order ID
 * Format: ORD-YYYY-XXXXX (e.g., ORD-2025-A7F9K)
 */
const generateOrderId = () => {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 5);
  return `ORD-${year}-${randomPart}`;
};

module.exports = generateOrderId;
