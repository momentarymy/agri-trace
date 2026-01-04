const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Get user list (with optional status filter)
exports.getUsers = asyncHandler(async (req, res) => {
  const { status, role } = req.query;
  const where = {};
  
  if (status !== undefined) {
    where.status = status;
  }
  if (role) {
    where.role = role;
  }

  const users = await User.findAll({
    where,
    attributes: { exclude: ['password'] }, // Don't return passwords
    order: [['created_at', 'DESC']]
  });

  res.json(users);
});

// Update user status (Approve/Reject/Disable)
exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 1: Active, 2: Disabled

  const user = await User.findByPk(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.status = status;
  await user.save();

  res.json({ message: 'User status updated', user });
});
