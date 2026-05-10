const crypto = require("crypto");

/**
 * Generate a 10-digit account number
 */
const generateAccountNumber = () => {
  // Generate 9 random digits
  const randomDigits = crypto.randomInt(100000000, 999999999);

  return `1${randomDigits}`; // ensures 10 digits starting with 1
};

module.exports = generateAccountNumber;