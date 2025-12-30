const statsService = require('../services/statsService');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getDashboardStats();
  res.json(stats);
});
