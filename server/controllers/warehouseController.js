const Stock = require('../models/Stock');
const StockLog = require('../models/StockLog');
const Batch = require('../models/Batch');
const User = require('../models/User');
const { sequelize } = require('../config/db');

// 获取库存列表
exports.getStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll({
      include: [{
        model: Batch,
        as: 'batch',
        attributes: ['batch_no', 'crop_name']
      }],
      order: [['updated_at', 'DESC']]
    });
    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '获取库存失败' });
  }
};

// 出入库操作
exports.operateStock = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { batch_id, type, quantity, remark } = req.body;
    
    let operator = '未知用户';
    if (req.user) {
        if (req.user.username) {
            operator = req.user.username;
        } else if (req.user.id) {
            const u = await User.findByPk(req.user.id);
            if (u) operator = u.username;
        }
    }

    if (!batch_id || !type || !quantity) {
      return res.status(400).json({ message: '参数不完整' });
    }

    const numQuantity = parseFloat(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      return res.status(400).json({ message: '数量必须大于0' });
    }

    // 1. 查找或初始化库存记录
    let stock = await Stock.findOne({ where: { batch_id }, transaction: t });
    
    if (!stock) {
      if (type === 'out') {
        await t.rollback();
        return res.status(400).json({ message: '该批次无库存，无法出库' });
      }
      stock = await Stock.create({
        batch_id,
        quantity: 0,
        unit: 'kg' // 默认单位
      }, { transaction: t });
    }

    // 2. 更新库存
    if (type === 'in') {
      stock.quantity += numQuantity;
    } else if (type === 'out') {
      if (stock.quantity < numQuantity) {
        await t.rollback();
        return res.status(400).json({ message: `库存不足，当前仅剩 ${stock.quantity}` });
      }
      stock.quantity -= numQuantity;
    }

    await stock.save({ transaction: t });

    // 3. 记录日志
    await StockLog.create({
      batch_id,
      type,
      quantity: numQuantity,
      operator,
      remark
    }, { transaction: t });

    await t.commit();
    res.json({ message: '操作成功', stock });

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: '操作失败' });
  }
};

// 获取出入库记录
exports.getLogs = async (req, res) => {
  try {
    const logs = await StockLog.findAll({
      include: [{
        model: Batch,
        as: 'batch',
        attributes: ['batch_no', 'crop_name']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '获取记录失败' });
  }
};
