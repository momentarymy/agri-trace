const Farmland = require('../models/Farmland');
const User = require('../models/User');

// 获取地块列表
exports.getAll = async (req, res) => {
  try {
    const { role, id } = req.user;
    let whereClause = {};

    // 如果是农户，只能看自己的地块
    if (role === 'farmer') {
      whereClause.owner_id = id;
    }
    // 管理员可以看到所有，也可以根据 query 参数筛选
    
    const list = await Farmland.findAll({
      where: whereClause,
      include: [{ model: User, as: 'owner', attributes: ['username'] }],
      order: [['created_at', 'DESC']]
    });

    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建地块
exports.create = async (req, res) => {
  try {
    const { name, location, area } = req.body;
    const { id } = req.user;

    const newFarmland = await Farmland.create({
      name,
      location,
      area,
      owner_id: id
    });

    res.status(201).json({ message: '创建成功', data: newFarmland });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除地块
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const farmland = await Farmland.findByPk(id);
    if (!farmland) {
      return res.status(404).json({ message: '地块不存在' });
    }

    // 权限检查：只有拥有者或管理员可以删除
    if (userRole !== 'admin' && farmland.owner_id !== userId) {
      return res.status(403).json({ message: '无权删除此地块' });
    }

    await farmland.destroy();
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};
