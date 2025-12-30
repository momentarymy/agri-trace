const axios = require('axios');

class IoTService {
  async getRealTimeData(city = 'Beijing') {
    let realTimeData = {
      temperature: 0,
      humidity: 0,
      update_time: new Date(),
      device_status: 'online',
      alerts: [],
      source: 'mock'
    };

    try {
      const url = `https://wttr.in/${city}?format=j1`;
      console.log(`正在请求天气数据: ${url}`);
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data && response.data.current_condition && response.data.current_condition[0]) {
        const current = response.data.current_condition[0];
        realTimeData.temperature = current.temp_C;
        realTimeData.humidity = current.humidity;
        realTimeData.source = 'api';
        
        if (response.data.nearest_area && response.data.nearest_area[0]) {
            const area = response.data.nearest_area[0];
            realTimeData.location = area.areaName[0].value;
        } else {
            realTimeData.location = city;
        }
      }
    } catch (apiError) {
      console.log('天气 API 请求失败，使用模拟数据:', apiError.message);
      realTimeData.temperature = (20 + Math.random() * 5).toFixed(1);
      realTimeData.humidity = (60 + Math.random() * 10).toFixed(1);
    }

    const temp = parseFloat(realTimeData.temperature);
    if (temp > 30) {
      realTimeData.alerts.push({ type: 'warning', message: `高温警告: ${temp}℃` });
    } else if (temp < 5) {
      realTimeData.alerts.push({ type: 'warning', message: `低温警告: ${temp}℃` });
    }

    return realTimeData;
  }

  async getHistoryData(period = '24h') {
    const now = new Date();
    const history = [];
    const month = now.getMonth() + 1;
    
    let baseTemp = 20;
    if (month >= 11 || month <= 3) {
        baseTemp = -5;
    } else if (month >= 6 && month <= 8) {
        baseTemp = 28;
    }

    for (let i = 0; i < 12; i++) {
      const time = new Date(now.getTime() - (11 - i) * 3600 * 1000);
      const hour = time.getHours();
      const hourOffset = -Math.abs(hour - 14) / 2;

      history.push({
        time: `${hour}:00`,
        temperature: (baseTemp + hourOffset + Math.random() * 2).toFixed(1),
        humidity: (50 + Math.random() * 20).toFixed(1)
      });
    }

    return history;
  }
}

module.exports = new IoTService();
