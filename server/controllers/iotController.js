const SensorData = require('../models/SensorData');
const Transport = require('../models/Transport');
const { Op } = require('sequelize');
const axios = require('axios');

// 获取实时监控数据 (接入真实天气API)
exports.getRealTimeData = async (req, res) => {
  try {
    const city = req.query.city || 'Beijing'; // 默认查询北京，避免IP定位不准
    let realTimeData = {
      temperature: 0,
      humidity: 0,
      update_time: new Date(),
      device_status: 'online',
      alerts: [],
      source: 'mock'
    };

    try {
      // 使用 wttr.in 免费接口
      const url = `https://wttr.in/${city}?format=j1`;
      console.log(`正在请求天气数据: ${url}`);
      // 增加超时时间到 10秒，避免网络波动导致失败
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data && response.data.current_condition && response.data.current_condition[0]) {
        const current = response.data.current_condition[0];
        realTimeData.temperature = current.temp_C;
        realTimeData.humidity = current.humidity;
        realTimeData.source = 'api';
        
        // 获取城市名
        if (response.data.nearest_area && response.data.nearest_area[0]) {
            // 优先显示中文名(如果有)，或者 areaName
            const area = response.data.nearest_area[0];
            realTimeData.location = area.areaName[0].value;
        } else {
            realTimeData.location = city;
        }
        console.log('天气数据获取成功:', realTimeData.location, realTimeData.temperature);
      }
    } catch (apiError) {
      console.log('天气API请求失败，使用模拟数据:', apiError.message);
      // API 失败时回退到模拟数据
      realTimeData.temperature = (20 + Math.random() * 5).toFixed(1);
      realTimeData.humidity = (60 + Math.random() * 10).toFixed(1);
    }

    // 报警逻辑
    const temp = parseFloat(realTimeData.temperature);
    if (temp > 30) {
      realTimeData.alerts.push({ type: 'warning', message: `高温警告: ${temp}℃` });
    } else if (temp < 5) {
      realTimeData.alerts.push({ type: 'warning', message: `低温警告: ${temp}℃` });
    }

    res.json(realTimeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '获取实时数据失败' });
  }
};

// 获取历史趋势数据
exports.getHistoryData = async (req, res) => {
  try {
    const { period = '24h' } = req.query;
    
    // 如果数据库没有足够的数据，我们生成一些模拟的历史数据用于演示图表
    // 实际开发中应查询 SensorData 表
    
    const now = new Date();
    const history = [];
    const month = now.getMonth() + 1; // 1-12
    
    // 根据季节调整模拟数据的基准温度
    let baseTemp = 20;
    if (month >= 11 || month <= 3) {
        baseTemp = -5; // 冬季
    } else if (month >= 6 && month <= 8) {
        baseTemp = 28; // 夏季
    }

    for (let i = 0; i < 12; i++) {
      const time = new Date(now.getTime() - (11 - i) * 3600 * 1000); // 过去12小时，每小时一个点
      // 模拟一天内的温度变化：中午高，早晚低
      const hour = time.getHours();
      const hourOffset = -Math.abs(hour - 14) / 2; // 简单模拟：14点最热，距离越远越冷

      history.push({
        time: `${hour}:00`,
        temperature: (baseTemp + hourOffset + Math.random() * 2).toFixed(1),
        humidity: (50 + Math.random() * 20).toFixed(1)
      });
    }

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '获取历史数据失败' });
  }
};

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
