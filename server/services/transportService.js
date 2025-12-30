const Transport = require('../models/Transport');
const Batch = require('../models/Batch');
const Farmland = require('../models/Farmland');

class TransportService {
  async getList() {
    return await Transport.findAll({
      include: [{
        model: Batch,
        as: 'batch',
        attributes: ['batch_no', 'crop_name'],
        include: [{ model: Farmland, as: 'farmland', attributes: ['name'] }]
      }],
      order: [['created_at', 'DESC']]
    });
  }

  async create(data) {
    return await Transport.create(data);
  }

  async arrive(id) {
    const transport = await Transport.findByPk(id);
    if (!transport) throw new Error('运单不存在');

    transport.status = 1;
    transport.end_time = new Date();
    await transport.save();

    // Update batch status to "Marketed" (2)
    await Batch.update({ status: 2 }, { where: { id: transport.batch_id } });
  }

  async addTempLog(id, temp) {
    const transport = await Transport.findByPk(id);
    if (!transport) throw new Error('运单不存在');

    const logs = transport.temperature_logs || [];
    logs.push({
      time: new Date(),
      temp: temp || (Math.random() * 5 + 2).toFixed(1)
    });

    transport.temperature_logs = logs;
    await transport.save();
    
    return logs;
  }
}

module.exports = new TransportService();
