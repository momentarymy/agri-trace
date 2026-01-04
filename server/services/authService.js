const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'agri_trace_secret_key_2025';

// Account Status Constants
const ACCOUNT_STATUS = {
  PENDING: 0, // 待审核
  ACTIVE: 1,  // 正常
  DISABLED: 2 // 禁用
};

// User Roles Constants
const USER_ROLES = {
  ADMIN: 'admin',
  FARMER: 'farmer',
  ENTERPRISE: 'enterprise',
  CONSUMER: 'consumer'
};

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - { username, password, role, phone }
   */
  async register({ username, password, role, phone }) {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine account status based on role
    let accountStatus = ACCOUNT_STATUS.ACTIVE; // Default to active
    
    if (role === USER_ROLES.FARMER || role === USER_ROLES.ENTERPRISE) {
      accountStatus = ACCOUNT_STATUS.PENDING; // Requires approval
    } else if (role === USER_ROLES.ADMIN) {
       throw new Error('管理员账号无法通过注册创建');
    }

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: role || USER_ROLES.CONSUMER,
      phone,
      status: accountStatus
    });

    return {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      status: newUser.status
    };
  }

  /**
   * User Login
   * @param {Object} credentials - { username, password }
   */
  async login({ username, password }) {
    const user = await User.findOne({ where: { username } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('用户名或密码错误');
    }

    if (user.status === ACCOUNT_STATUS.PENDING) {
      throw new Error('账号正在审核中，请耐心等待');
    }
    if (user.status === ACCOUNT_STATUS.DISABLED) {
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
