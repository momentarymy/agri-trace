const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Batch = require('./Batch');

const Harvest = sequelize.define('Harvest', {
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
  harvest_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  quantity: {
    type: DataTypes.STRING, // 例如 "500kg"
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING, // 例如 "特级", "一级"
    defaultValue: '合格'
  },
  images: {
    type: DataTypes.TEXT,
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
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'prod_harvests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Harvest.belongsTo(Batch, { foreignKey: 'batch_id', as: 'batch' });
Batch.hasOne(Harvest, { foreignKey: 'batch_id', as: 'harvest' });

module.exports = Harvest;
