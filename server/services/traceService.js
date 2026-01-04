const { Op } = require('sequelize');
const Batch = require('../models/Batch');
const Farmland = require('../models/Farmland');
const Operation = require('../models/Operation');
const Harvest = require('../models/Harvest');
const Transport = require('../models/Transport');
const User = require('../models/User');
const QualityCheck = require('../models/QualityCheck');

class TraceService {
  async getTraceInfo(queryId) {
    // 1. Get Batch Info + Farmland
    const whereClause = {
        [Op.or]: [
            { batch_no: queryId }
        ]
    };
    
    if (/^\d+$/.test(queryId)) {
        whereClause[Op.or].push({ id: queryId });
    }

    const batch = await Batch.findOne({
      where: whereClause,
      include: [{
        model: Farmland,
        as: 'farmland'
      }]
    });

    if (!batch) {
      throw new Error('Batch not found');
    }

    const batchId = batch.id;

    // 2. Get Operations
    const operations = await Operation.findAll({
      where: { batch_id: batchId },
      order: [['operate_time', 'ASC']]
    });

    // 3. Get Harvest Info
    const harvest = await Harvest.findOne({
      where: { batch_id: batchId }
    });

    // 4. Get Transport Info
    const transport = await Transport.findOne({
      where: { batch_id: batchId }
    });

    // 5. Get Quality Checks
    const qualityChecks = await QualityCheck.findAll({
      where: { batch_id: batchId },
      order: [['check_date', 'ASC']]
    });

    // 6. Assemble Data
    return {
      product: {
        name: batch.crop_name,
        batch_no: batch.batch_no,
        status: batch.status,
        planting_date: batch.planting_date
      },
      origin: {
        farmland_name: batch.farmland ? batch.farmland.name : 'Unknown Farmland',
        location: batch.farmland ? batch.farmland.location : '',
        area: batch.farmland ? batch.farmland.area : ''
      },
      timeline: operations.map(op => ({
        date: op.operate_time,
        type: op.type,
        desc: op.description,
        images: op.images || [],
        operator: op.operator || 'Unknown'
      })),
      harvest: harvest ? {
        time: harvest.harvest_time,
        quantity: harvest.quantity,
        grade: harvest.grade,
        images: harvest.images || [],
        operator: harvest.operator || 'Unknown'
      } : null,
      quality: qualityChecks.map(qc => ({
        date: qc.check_date,
        item: qc.check_item,
        result: qc.result,
        inspector: qc.inspector,
        remarks: qc.remarks
      })),
      transport: transport ? {
        start_time: transport.start_time,
        end_time: transport.end_time,
        vehicle: transport.vehicle_no,
        origin: transport.origin || '',
        destination: transport.destination,
        driver: transport.driver_name || 'Unknown',
        temp_logs: transport.temperature_logs || []
      } : null
    };
  }
}

module.exports = new TraceService();
