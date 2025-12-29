const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Farmland = require('./Farmland');

const Batch = sequelize.define('Batch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  batch_no: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  crop_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  farmland_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Farmland,
      key: 'id'
    }
  },
  planting_date: {
    type: DataTypes.DATEONLY
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0 // 0:种植中, 1:已采摘, 2:已上市
  }
}, {
  tableName: 'prod_batches',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Batch.belongsTo(Farmland, { foreignKey: 'farmland_id', as: 'farmland' });

module.exports = Batch;
