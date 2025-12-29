const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Batch = require('./Batch');

const Operation = sequelize.define('Operation', {
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
    type: DataTypes.STRING,
    allowNull: false // 施肥/浇水/除虫等
  },
  description: {
    type: DataTypes.TEXT
  },
  images: {
    type: DataTypes.TEXT, // 存储 JSON 字符串
    get() {
      const rawValue = this.getDataValue('images');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value));
    }
  },
  operator: {
    type: DataTypes.STRING
  },
  operate_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'prod_operations',
  timestamps: false
});

Operation.belongsTo(Batch, { foreignKey: 'batch_id', as: 'batch' });

module.exports = Operation;
