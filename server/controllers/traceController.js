const Batch = require('../models/Batch');
const Farmland = require('../models/Farmland');
const Operation = require('../models/Operation');
const Harvest = require('../models/Harvest');

// 获取完整的溯源信息
exports.getTraceInfo = async (req, res) => {
  try {
    const { batchId } = req.params;

    // 1. 获取批次基本信息 + 地块信息
    const batch = await Batch.findOne({
      where: { id: batchId },
      include: [{
        model: Farmland,
        as: 'farmland'
      }]
    });

    if (!batch) {
      return res.status(404).json({ message: '未找到该批次信息' });
    }

    // 2. 获取农事记录
    const operations = await Operation.findAll({
      where: { batch_id: batchId },
      order: [['operate_time', 'ASC']]
    });

    // 3. 获取采摘/上市信息
    const harvest = await Harvest.findOne({
      where: { batch_id: batchId }
    });

    // 4. 组装数据
    const traceData = {
      product: {
        name: batch.crop_name,
        batch_no: batch.batch_no,
        status: batch.status,
        planting_date: batch.planting_date
      },
      origin: {
        farmland_name: batch.farmland ? batch.farmland.name : '未知地块',
        location: batch.farmland ? batch.farmland.location : '',
        area: batch.farmland ? batch.farmland.area : ''
      },
      timeline: operations.map(op => ({
        date: op.operate_time,
        type: op.type,
        desc: op.description,
        images: op.images,
        operator: op.operator
      })),
      harvest: harvest ? {
        time: harvest.harvest_time,
        quantity: harvest.quantity,
        grade: harvest.grade,
        images: harvest.images,
        operator: harvest.operator
      } : null
    };

    res.json(traceData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};
