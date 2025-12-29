const { Sequelize } = require('sequelize');

// 数据库配置
// 注意：请根据你的本地 MySQL 设置修改 password
const sequelize = new Sequelize('agri_trace', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '+08:00', // 东八区时间
  logging: false,     // 关闭控制台 SQL 语句输出
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 测试连接函数
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功 (MySQL Connected)');
    
    // 自动同步表结构
    await sequelize.sync({ alter: true });
    console.log('✅ 数据表同步完成');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
  }
};

module.exports = { sequelize, connectDB };
