const batchService = require('../services/batchService');
const asyncHandler = require('../utils/asyncHandler');

exports.getAll = asyncHandler(async (req, res) => {
  const list = await batchService.getAll();
  res.json(list);
});

exports.create = asyncHandler(async (req, res) => {
  const batch = await batchService.create(req.body);
  res.status(201).json({ message: '创建成功', data: batch });
});

exports.getById = asyncHandler(async (req, res) => {
  try {
    const batch = await batchService.getById(req.params.id);
    res.json(batch);
  } catch (error) {
    if (error.message === 'Batch not found') {
      return res.status(404).json({ message: '批次不存在' });
    }
    throw error;
  }
});
