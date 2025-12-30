const qualityService = require('../services/qualityService');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  const result = await qualityService.create(req.body);
  res.status(201).json({ message: '质检记录添加成功', data: result });
});

exports.getByBatch = asyncHandler(async (req, res) => {
  const list = await qualityService.getByBatch(req.params.batchId);
  res.json(list);
});

exports.getAll = asyncHandler(async (req, res) => {
    const list = await qualityService.getAll();
    res.json(list);
});
