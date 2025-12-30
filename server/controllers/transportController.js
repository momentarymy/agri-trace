const transportService = require('../services/transportService');
const asyncHandler = require('../utils/asyncHandler');

exports.getList = asyncHandler(async (req, res) => {
  const list = await transportService.getList();
  res.json(list);
});

exports.create = asyncHandler(async (req, res) => {
  const transport = await transportService.create(req.body);
  res.status(201).json({ message: '调度成功', data: transport });
});

exports.arrive = asyncHandler(async (req, res) => {
  try {
    await transportService.arrive(req.params.id);
    res.json({ message: '已确认送达' });
  } catch (error) {
    if (error.message === '运单不存在') return res.status(404).json({ message: error.message });
    throw error;
  }
});

exports.addTempLog = asyncHandler(async (req, res) => {
  try {
    const logs = await transportService.addTempLog(req.params.id, req.body.temp);
    res.json({ message: '数据上传成功', data: logs });
  } catch (error) {
    if (error.message === '运单不存在') return res.status(404).json({ message: error.message });
    throw error;
  }
});
