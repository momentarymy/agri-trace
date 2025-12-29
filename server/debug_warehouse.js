// const axios = require('axios');

async function testOperate() {
  try {
    // 1. Login to get token (assuming we have a user, or we can mock the request if we run this on server side directly invoking controller? No, better to hit the API)
    // Actually, I can just use the controller logic directly in a script to see the error stack trace, 
    // but I need to mock req and res.
    
    // Alternatively, I can just run a script that connects to DB and tries to execute the logic.
    
    const { sequelize } = require('./config/db');
    const Stock = require('./models/Stock');
    const StockLog = require('./models/StockLog');
    const Batch = require('./models/Batch');
    
    await sequelize.authenticate();
    console.log('DB Connected');
    
    // Sync to make sure tables exist (in case app.js didn't finish or failed silently)
    await sequelize.sync({ alter: true });
    console.log('Sync done');

    const t = await sequelize.transaction();
    try {
        const batch_id = 1; // Assuming batch 1 exists
        const type = 'in';
        const quantity = 100;
        const remark = 'Test In';
        const operator = 'TestUser';

        console.log('Finding stock...');
        let stock = await Stock.findOne({ where: { batch_id }, transaction: t });
        
        if (!stock) {
            console.log('Creating stock...');
            stock = await Stock.create({
                batch_id,
                quantity: 0,
                unit: 'kg'
            }, { transaction: t });
        }

        console.log('Updating stock...');
        stock.quantity += quantity;
        await stock.save({ transaction: t });

        console.log('Creating log...');
        await StockLog.create({
            batch_id,
            type,
            quantity,
            operator,
            remark
        }, { transaction: t });

        await t.commit();
        console.log('Success!');
    } catch (error) {
        await t.rollback();
        console.error('Transaction failed:', error);
    }

  } catch (e) {
    console.error('Global error:', e);
  } finally {
      // await sequelize.close(); // Keep open if needed, or close
      process.exit();
  }
}

testOperate();
