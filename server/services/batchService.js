const Batch = require('../models/Batch');
const Farmland = require('../models/Farmland');

class BatchService {
  async getAll() {
    // In a real project, we might want to filter by user permissions here too
    return await Batch.findAll({
      include: [{ model: Farmland, as: 'farmland', attributes: ['name'] }],
      order: [['created_at', 'DESC']]
    });
  }

  async create({ crop_name, farmland_id, planting_date }) {
    // Generate batch number: B + timestamp + random
    const batch_no = 'B' + Date.now() + Math.floor(Math.random() * 1000);

    return await Batch.create({
      batch_no,
      crop_name,
      farmland_id,
      planting_date
    });
  }

  async getById(id) {
    const batch = await Batch.findByPk(id, {
      include: [{ model: Farmland, as: 'farmland', attributes: ['name'] }]
    });
    if (!batch) throw new Error('Batch not found');
    return batch;
  }
}

module.exports = new BatchService();
