const crypto = require("crypto");

/**
 * Generate a unique transaction reference
 * Format: TXN-<timestamp>-<random>
 * Example: TXN-1700000000000-A1B2C3D4
 */
const generateReference = (prefix = "TXN") => {
  const timestamp = Date.now(); // ensures time-based uniqueness

  const randomPart = crypto
    .randomBytes(4) // 4 bytes = 8 hex characters
    .toString("hex")
    .toUpperCase();

  return `${prefix}-${timestamp}-${randomPart}`;
};

module.exports = generateReference;