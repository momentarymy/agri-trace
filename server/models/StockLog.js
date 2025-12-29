const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Batch = require('./Batch');

const StockLog = sequelize.define('StockLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  batch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Batch,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('in', 'out'),
    allowNull: false,
    comment: 'in:入库, out:出库'
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  operator: {
    type: DataTypes.STRING,
    allowNull: false
  },
  remark: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'wh_stock_logs',
  timestamps: true,
  updatedAt: false,
  createdAt: 'created_at'
});

StockLog.belongsTo(Batch, { foreignKey: 'batch_id', as: 'batch' });

module.exports = StockLog;
