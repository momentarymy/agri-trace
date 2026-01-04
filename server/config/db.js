const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'agri_trace',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '123456',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    timezone: '+08:00',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
   
    if (process.env.NODE_ENV !== 'production') {
      // Synchronize models with database
      // Note: Using sync() without { alter: true } is safer for production-like environments
      // to avoid accidental schema changes or index duplication.
      await sequelize.sync(); 
      console.log('数据表同步完成 (Data Sync Completed)');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
