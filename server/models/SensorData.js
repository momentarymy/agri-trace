const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Transport = require('./Transport');

const SensorData = sequelize.define('SensorData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transport_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // 可以为空，表示仓库传感器或未绑定车辆的传感器
    references: {
      model: Transport,
      key: 'id'
    }
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '温度(℃)'
  },
  humidity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '湿度(%RH)'
  },
  location: {
    type: DataTypes.STRING,
    comment: '当前位置(GPS或仓库位置)'
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '设备编号'
  }
}, {
  tableName: 'iot_sensor_data',
  timestamps: true,
  updatedAt: false,
  createdAt: 'created_at'
});

SensorData.belongsTo(Transport, { foreignKey: 'transport_id', as: 'transport' });

module.exports = SensorData;
