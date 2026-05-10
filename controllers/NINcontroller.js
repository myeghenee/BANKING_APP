const ninService = require("../services/serviceNibss");

// Link NIN
const linkNIN = async (req, res, next) => {
  try {
    const { nin } = req.body;

    const result = await ninService.linkNIN(req.user.id, nin);

    res.status(200).json({
      success: true,
      message: "NIN linked successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Verify NIN
const verifyNIN = async (req, res, next) => {
  try {
    const { nin } = req.body;

    const result = await ninService.verifyNIN(nin);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get NIN status
const getNINStatus = async (req, res, next) => {
  try {
    const status = await ninService.getNINStatus(req.user.id);

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  linkNIN,
  verifyNIN,
  getNINStatus,
};