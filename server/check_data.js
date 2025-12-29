const { sequelize } = require('./config/db');
const Batch = require('./models/Batch');

async function checkData() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    const batches = await Batch.findAll();
    console.log('All Batches:', JSON.stringify(batches, null, 2));
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

checkData();
