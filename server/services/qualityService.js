const QualityCheck = require('../models/QualityCheck');
const Batch = require('../models/Batch');
const Farmland = require('../models/Farmland');

class QualityService {
  async create(data) {
    return await QualityCheck.create({
        ...data,
        check_date: data.check_date || new Date()
    });
  }

  async getByBatch(batchId) {
    return await QualityCheck.findAll({
      where: { batch_id: batchId },
      order: [['check_date', 'DESC']]
    });
  }
  
  async getAll() {
      return await QualityCheck.findAll({
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
          order: [['check_date', 'DESC']]
      });
  }
}

module.exports = new QualityService();
