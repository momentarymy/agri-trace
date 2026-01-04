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

    // Determine status based on role
    let status = 1; // Default active
    if (role === 'farmer' || role === 'enterprise') {
      status = 0; // Pending approval
    } else if (role === 'admin') {
       throw new Error('管理员账号无法通过注册创建');
    }

    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || 'consumer',
      phone,
      status
    });

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      status: user.status
    };
  }

  async login({ username, password }) {
    const user = await User.findOne({ where: { username } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('用户名或密码错误');
    }

    if (user.status === 0) {
      throw new Error('账号正在审核中，请耐心等待');
    }
    if (user.status === 2) {
      throw new Error('账号已被禁用');
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

  async updateProfile(userId, { username, oldPassword, newPassword }) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // Update username if provided
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw new Error('用户名已存在');
      }
      user.username = username;
    }

    // Update password if provided
    if (newPassword) {
      if (!oldPassword) {
        throw new Error('修改密码需要提供旧密码');
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new Error('旧密码错误');
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      avatar: user.avatar
    };
  }
}

module.exports = new AuthService();
