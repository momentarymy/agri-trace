const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Batch = require('./Batch');

const Transport = sequelize.define('Transport', {
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
  vehicle_no: {
    type: DataTypes.STRING,
    allowNull: false
  },
  driver_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  driver_phone: {
    type: DataTypes.STRING
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  end_time: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0 // 0:运输中, 1:已送达
  },
  temperature_logs: {
    type: DataTypes.TEXT, // JSON array: [{time, temp}, ...]
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('temperature_logs');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('temperature_logs', JSON.stringify(value));
    }
  }
}, {
  tableName: 'logistics_transports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Transport.belongsTo(Batch, { foreignKey: 'batch_id', as: 'batch' });

module.exports = Transport;
