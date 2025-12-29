const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 密钥，实际项目中应该放在环境变量中
const JWT_SECRET = 'agri_trace_secret_key_2025';

// 注册
exports.register = async (req, res) => {
  try {
    const { username, password, role, phone } = req.body;

    // 1. 检查用户是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 2. 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. 创建用户
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: role || 'consumer',
      phone
    });

    res.status(201).json({
      message: '注册成功',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. 查找用户
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }

    // 2. 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }

    // 3. 生成 Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};
