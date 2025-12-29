const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'farmer', 'enterprise', 'consumer'),
    defaultValue: 'consumer'
  },
  phone: {
    type: DataTypes.STRING
  },
  avatar: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'sys_users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false // 数据库表中没有 updated_at 字段，所以关闭
});

module.exports = User;
