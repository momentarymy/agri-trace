const Operation = require('../models/Operation');
const Batch = require('../models/Batch');
const Farmland = require('../models/Farmland');

// 获取所有农事记录（最新一览）
exports.getAll = async (req, res) => {
  try {
    const list = await Operation.findAll({
      include: [{
        model: Batch,
        as: 'batch',
        attributes: ['batch_no', 'crop_name'],
        include: [{
          model: Farmland,
          as: 'farmland',
          attributes: ['name']
        }]
      }],
      order: [['operate_time', 'DESC']],
      limit: 50
    });
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取某批次的农事记录
exports.getByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const list = await Operation.findAll({
      where: { batch_id: batchId },
      order: [['operate_time', 'DESC']]
    });
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 添加农事记录
exports.create = async (req, res) => {
  try {
    const { batch_id, type, description, images, operator, operate_time } = req.body;

    const newOp = await Operation.create({
      batch_id,
      type,
      description,
      images: images || [],
      operator,
      operate_time: operate_time || new Date()
    });

    res.status(201).json({ message: '记录成功', data: newOp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};
