const { sequelize } = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function resetAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const username = 'admin';
    const password = '123456';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [user, created] = await User.findOrCreate({
      where: { username },
      defaults: {
        password: hashedPassword,
        role: 'admin',
        phone: '13800000000'
      }
    });

    if (!created) {
      user.password = hashedPassword;
      user.role = 'admin';
      await user.save();
      console.log('Admin user updated.');
    } else {
      console.log('Admin user created.');
    }

    console.log('--------------------------------');
    console.log(`账号: ${username}`);
    console.log(`密码: ${password}`);
    console.log('--------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetAdmin();
