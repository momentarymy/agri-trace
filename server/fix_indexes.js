const { sequelize } = require('./config/db');

async function checkIndexes() {
  try {
    await sequelize.authenticate();
    console.log('Connected.');
    const [results] = await sequelize.query("SHOW INDEX FROM sys_users");
    console.log('Indexes:', results.map(r => r.Key_name));
    
    // If there are many indexes starting with 'username', drop them
    const usernameIndexes = results.filter(r => r.Key_name !== 'PRIMARY' && r.Key_name.includes('username'));
    console.log(`Found ${usernameIndexes.length} indexes related to username.`);

    if (usernameIndexes.length > 1) {
        console.log('Cleaning up duplicate indexes...');
        for (const idx of usernameIndexes) {
            // Keep one if you want, or drop all and let sequelize recreate
            // But sequelize usually names it 'username' or 'username_2'
            // Let's drop all 'username' related indexes except maybe the first one if it looks normal?
            // Actually, safe to drop all unique indexes on username and let sync recreate the correct one.
            try {
                await sequelize.query(`DROP INDEX \`${idx.Key_name}\` ON sys_users`);
                console.log(`Dropped index: ${idx.Key_name}`);
            } catch (e) {
                console.error(`Failed to drop ${idx.Key_name}:`, e.message);
            }
        }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkIndexes();
