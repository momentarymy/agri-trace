const { sequelize } = require('./config/db');
const Transport = require('./models/Transport');

async function init() {
  try {
    await sequelize.authenticate();
    console.log('DB Connected');
    
    await Transport.sync({ alter: true });
    console.log('Transport table synced');
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

init();
