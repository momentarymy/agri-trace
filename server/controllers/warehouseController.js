const warehouseService = require('../services/warehouseService');
const asyncHandler = require('../utils/asyncHandler');

exports.getStocks = asyncHandler(async (req, res) => {
  const stocks = await warehouseService.getStocks();
  res.json(stocks);
});

exports.operateStock = asyncHandler(async (req, res) => {
  const stock = await warehouseService.operateStock(req.body, req.user);
  res.json({ message: 'Operation successful', stock });
});

exports.getLogs = asyncHandler(async (req, res) => {
  const logs = await warehouseService.getLogs();
  res.json(logs);
});
