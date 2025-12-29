const { sequelize } = require('../config/db');
const Farmland = require('../models/Farmland');
const Batch = require('../models/Batch');
const Operation = require('../models/Operation');
const User = require('../models/User');
const Harvest = require('../models/Harvest');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. 基础计数
    const farmlandCount = await Farmland.count();
    const batchCount = await Batch.count();
    const operationCount = await Operation.count();
    const userCount = await User.count();

    // 2. 批次状态分布
    const batchStatus = await Batch.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // 3. 作物种类分布
    const cropDist = await Batch.findAll({
      attributes: [
        'crop_name',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['crop_name'],
      limit: 5,
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    // 4. 最近采摘量 (模拟数据，实际应按时间聚合)
    const recentHarvests = await Harvest.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [{ model: Batch, as: 'batch', attributes: ['crop_name'] }]
    });

    res.json({
      counts: {
        farmlands: farmlandCount,
        batches: batchCount,
        operations: operationCount,
        users: userCount
      },
      batchStatus: batchStatus.map(item => ({
        status: item.status, // 0:种植中, 1:已采摘, 2:已上市
        count: item.get('count')
      })),
      cropDist: cropDist.map(item => ({
        crop_name: item.crop_name,
        count: item.get('count')
      })),
      recentHarvests
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};
