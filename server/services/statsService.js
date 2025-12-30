const { sequelize } = require('../config/db');
const Farmland = require('../models/Farmland');
const Batch = require('../models/Batch');
const Operation = require('../models/Operation');
const User = require('../models/User');
const Harvest = require('../models/Harvest');

class StatsService {
  async getDashboardStats() {
    const farmlandCount = await Farmland.count();
    const batchCount = await Batch.count();
    const operationCount = await Operation.count();
    const userCount = await User.count();

    const batchStatus = await Batch.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const cropDist = await Batch.findAll({
      attributes: [
        'crop_name',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['crop_name'],
      limit: 5,
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    const recentHarvests = await Harvest.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [{ model: Batch, as: 'batch', attributes: ['crop_name'] }]
    });

    return {
      counts: {
        farmlands: farmlandCount,
        batches: batchCount,
        operations: operationCount,
        users: userCount
      },
      batchStatus: batchStatus.map(item => ({
        status: item.status,
        count: item.get('count')
      })),
      cropDist: cropDist.map(item => ({
        crop_name: item.crop_name,
        count: item.get('count')
      })),
      recentHarvests
    };
  }
}

module.exports = new StatsService();
