const Operation = require('../models/Operation');
const Batch = require('../models/Batch');
const Farmland = require('../models/Farmland');

class OperationService {
  async getAll() {
    return await Operation.findAll({
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
  }

  async getByBatch(batchId) {
    return await Operation.findAll({
      where: { batch_id: batchId },
      order: [['operate_time', 'DESC']]
    });
  }

  async create(data) {
    return await Operation.create({
      ...data,
      images: data.images || [],
      operate_time: data.operate_time || new Date()
    });
  }
}

module.exports = new OperationService();
