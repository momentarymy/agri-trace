const Harvest = require('../models/Harvest');
const Batch = require('../models/Batch');

class HarvestService {
  async create(data) {
    const harvest = await Harvest.create({
      ...data,
      images: data.images || [],
      harvest_time: data.harvest_time || new Date()
    });

    // Update batch status to "Harvested" (1)
    await Batch.update({ status: 1 }, { where: { id: data.batch_id } });

    return harvest;
  }

  async getByBatch(batchId) {
    const harvest = await Harvest.findOne({
      where: { batch_id: batchId }
    });
    
    if (!harvest) {
      throw new Error('未找到采摘记录');
    }
    
    return harvest;
  }
}

module.exports = new HarvestService();
