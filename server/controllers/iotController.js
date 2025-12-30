const iotService = require('../services/iotService');
const asyncHandler = require('../utils/asyncHandler');

exports.getRealTimeData = asyncHandler(async (req, res) => {
  const data = await iotService.getRealTimeData(req.query.city);
  res.json(data);
});

exports.getHistoryData = asyncHandler(async (req, res) => {
  const data = await iotService.getHistoryData(req.query.period);
  res.json(data);
});

// 上报数据 (用于模拟硬件上报)
exports.reportData = async (req, res) => {
  try {
    const { device_id, temperature, humidity, transport_id } = req.body;
    
    const newData = await SensorData.create({
      device_id,
      temperature,
      humidity,
      transport_id: transport_id || null
    });

    res.status(201).json({ message: '上报成功', data: newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '上报失败' });
  }
};
