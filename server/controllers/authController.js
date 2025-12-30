const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: '注册成功', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

exports.login = asyncHandler(async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json({ message: '登录成功', ...result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
