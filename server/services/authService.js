const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'agri_trace_secret_key_2025';

class AuthService {
  async register({ username, password, role, phone }) {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || 'consumer',
      phone
    });

    return {
      id: user.id,
      username: user.username,
      role: user.role
    };
  }

  async login({ username, password }) {
    const user = await User.findOne({ where: { username } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('用户名或密码错误');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatar: user.avatar
      }
    };
  }
}

module.exports = new AuthService();
