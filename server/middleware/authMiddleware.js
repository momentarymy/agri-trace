const jwt = require('jsonwebtoken');
const JWT_SECRET = 'agri_trace_secret_key_2025';

module.exports = (req, res, next) => {
  // 1. 获取 Token
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: '无访问权限，请先登录' });
  }

  try {
    // 2. 验证 Token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, ... }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token 无效或已过期' });
  }
};
