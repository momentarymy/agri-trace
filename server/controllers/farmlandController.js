const farmlandService = require('../services/farmlandService');
const asyncHandler = require('../utils/asyncHandler');

exports.getAll = asyncHandler(async (req, res) => {
  const list = await farmlandService.getAll(req.user);
  res.json(list);
});

exports.create = asyncHandler(async (req, res) => {
  const farmland = await farmlandService.create(req.body, req.user.id);
  res.status(201).json({ message: '创建成功', data: farmland });
});

exports.delete = asyncHandler(async (req, res) => {
  try {
    await farmlandService.delete(req.params.id, req.user);
    res.json({ message: '删除成功' });
  } catch (error) {
    if (error.message === '地块不存在') return res.status(404).json({ message: error.message });
    if (error.message === '无权删除此地块') return res.status(403).json({ message: error.message });
    throw error;
  }
});
