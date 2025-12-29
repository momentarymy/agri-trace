const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Farmland = sequelize.define('Farmland', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING
  },
  area: {
    type: DataTypes.DECIMAL(10, 2)
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'base_farmlands',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// 建立关联
Farmland.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

module.exports = Farmland;
