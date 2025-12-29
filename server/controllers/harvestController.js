const Harvest = require('../models/Harvest');
const Batch = require('../models/Batch');

// 创建采摘记录
exports.create = async (req, res) => {
  try {
    const { batch_id, quantity, grade, images, operator, notes, harvest_time } = req.body;

    // 1. 创建采摘记录
    const newHarvest = await Harvest.create({
      batch_id,
      quantity,
      grade,
      images: images || [],
      operator,
      notes,
      harvest_time: harvest_time || new Date()
    });

    // 2. 更新批次状态为 "已采摘" (1)
    await Batch.update({ status: 1 }, { where: { id: batch_id } });

    res.status(201).json({ message: '采摘登记成功', data: newHarvest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取某批次的采摘信息
exports.getByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const harvest = await Harvest.findOne({
      where: { batch_id: batchId }
    });
    
    if (!harvest) {
      return res.status(404).json({ message: '未找到采摘记录' });
    }
    
    res.json(harvest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};
