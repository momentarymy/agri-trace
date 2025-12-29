const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Batch = require('./Batch');

const Stock = sequelize.define('Stock', {
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
    },
    unique: true // 一个批次对应一条库存记录
  },
  quantity: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'kg'
  },
  location: {
    type: DataTypes.STRING,
    comment: '仓库位置'
  }
}, {
  tableName: 'wh_stocks',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

Stock.belongsTo(Batch, { foreignKey: 'batch_id', as: 'batch' });

module.exports = Stock;
