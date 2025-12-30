const harvestService = require('../services/harvestService');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  const harvest = await harvestService.create(req.body);
  res.status(201).json({ message: '采摘登记成功', data: harvest });
});

exports.getByBatch = asyncHandler(async (req, res) => {
  try {
    const harvest = await harvestService.getByBatch(req.params.batchId);
    res.json(harvest);
  } catch (error) {
    if (error.message === '未找到采摘记录') {
      return res.status(404).json({ message: error.message });
    }
    throw error;
  }
});
