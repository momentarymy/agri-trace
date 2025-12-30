const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Batch = require('./Batch');

const QualityCheck = sequelize.define('QualityCheck', {
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
  check_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  check_item: {
    type: DataTypes.STRING, // e.g., "农残检测", "糖度检测"
    allowNull: false
  },
  result: {
    type: DataTypes.STRING, // e.g., "合格", "12.5%"
    allowNull: false
  },
  inspector: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING, // Report image URL
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'quality_checks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Association
Batch.hasMany(QualityCheck, { foreignKey: 'batch_id', as: 'quality_checks' });
QualityCheck.belongsTo(Batch, { foreignKey: 'batch_id', as: 'batch' });

module.exports = QualityCheck;
