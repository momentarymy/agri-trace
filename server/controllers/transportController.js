const Transport = require('../models/Transport');
const Batch = require('../models/Batch');
const Farmland = require('../models/Farmland');

// 获取运输列表
exports.getList = async (req, res) => {
  try {
    const list = await Transport.findAll({
      include: [{
        model: Batch,
        as: 'batch',
        attributes: ['batch_no', 'crop_name'],
        include: [{ model: Farmland, as: 'farmland', attributes: ['name'] }]
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建运输单
exports.create = async (req, res) => {
  try {
    const { batch_id, vehicle_no, driver_name, driver_phone, destination } = req.body;

    const newTransport = await Transport.create({
      batch_id,
      vehicle_no,
      driver_name,
      driver_phone,
      destination
    });

    res.status(201).json({ message: '调度成功', data: newTransport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 确认送达
exports.arrive = async (req, res) => {
  try {
    const { id } = req.params;
    const transport = await Transport.findByPk(id);
    
    if (!transport) return res.status(404).json({ message: '运单不存在' });

    transport.status = 1;
    transport.end_time = new Date();
    await transport.save();

    // 更新批次状态为 "已上市" (2)
    await Batch.update({ status: 2 }, { where: { id: transport.batch_id } });

    res.json({ message: '已确认送达' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 模拟上传温湿度数据
exports.addTempLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { temp } = req.body; // 模拟温度
    
    const transport = await Transport.findByPk(id);
    if (!transport) return res.status(404).json({ message: '运单不存在' });

    const logs = transport.temperature_logs || [];
    logs.push({
      time: new Date(),
      temp: temp || (Math.random() * 5 + 2).toFixed(1) // 默认生成 2-7度的随机冷链温度
    });

    transport.temperature_logs = logs;
    await transport.save();

    res.json({ message: '数据上传成功', data: logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};
