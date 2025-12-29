const Batch = require('../models/Batch');
const Farmland = require('../models/Farmland');

// 获取批次列表
exports.getAll = async (req, res) => {
  try {
    // 实际项目中应根据用户权限筛选
    const list = await Batch.findAll({
      include: [{ model: Farmland, as: 'farmland', attributes: ['name'] }],
      order: [['created_at', 'DESC']]
    });
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建批次
exports.create = async (req, res) => {
  try {
    const { crop_name, farmland_id, planting_date } = req.body;
    
    // 自动生成批次号: B + 时间戳 + 随机数
    const batch_no = 'B' + Date.now() + Math.floor(Math.random() * 1000);

    const newBatch = await Batch.create({
      batch_no,
      crop_name,
      farmland_id,
      planting_date
    });

    res.status(201).json({ message: '创建成功', data: newBatch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};
