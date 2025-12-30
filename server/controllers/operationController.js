const operationService = require('../services/operationService');
const asyncHandler = require('../utils/asyncHandler');

exports.getAll = asyncHandler(async (req, res) => {
  const list = await operationService.getAll();
  res.json(list);
});

exports.getByBatch = asyncHandler(async (req, res) => {
  const list = await operationService.getByBatch(req.params.batchId);
  res.json(list);
});

exports.create = asyncHandler(async (req, res) => {
  const op = await operationService.create(req.body);
  res.status(201).json({ message: '记录成功', data: op });
});
