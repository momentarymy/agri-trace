const Stock = require('../models/Stock');
const StockLog = require('../models/StockLog');
const Batch = require('../models/Batch');
const User = require('../models/User');
const { sequelize } = require('../config/db');

class WarehouseService {
  async getStocks() {
    return await Stock.findAll({
      include: [{
        model: Batch,
        as: 'batch',
        attributes: ['batch_no', 'crop_name']
      }],
      order: [['updated_at', 'DESC']]
    });
  }

  async operateStock(data, user) {
    const { batch_id, type, quantity, remark } = data;
    
    let operator = 'Unknown User';
    if (user) {
        if (user.username) {
            operator = user.username;
        } else if (user.id) {
            const u = await User.findByPk(user.id);
            if (u) operator = u.username;
        }
    }

    if (!batch_id || !type || !quantity) {
      throw new Error('Missing parameters');
    }

    const numQuantity = parseFloat(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const t = await sequelize.transaction();

    try {
      // 1. Find or Init Stock
      let stock = await Stock.findOne({ where: { batch_id }, transaction: t });
      
      if (!stock) {
        if (type === 'out') {
          throw new Error('No stock for this batch, cannot stock out');
        }
        stock = await Stock.create({
          batch_id,
          quantity: 0,
          unit: 'kg'
        }, { transaction: t });
      }

      // 2. Update Stock
      if (type === 'in') {
        stock.quantity += numQuantity;
      } else if (type === 'out') {
        if (stock.quantity < numQuantity) {
          throw new Error(`Insufficient stock, current: ${stock.quantity}`);
        }
        stock.quantity -= numQuantity;
      }

      await stock.save({ transaction: t });

      // 3. Create Log
      await StockLog.create({
        batch_id,
        type,
        quantity: numQuantity,
        operator,
        remark
      }, { transaction: t });

      await t.commit();
      return stock;

    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getLogs() {
    return await StockLog.findAll({
      include: [{
        model: Batch,
        as: 'batch',
        attributes: ['batch_no', 'crop_name']
      }],
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = new WarehouseService();
