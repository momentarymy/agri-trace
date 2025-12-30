<template>
  <view class="container">
    <!-- 实时数据卡片 -->
    <view class="monitor-card">
      <view class="card-header">
        <view class="title-group">
          <text class="title">实时环境监测</text>
          <text v-if="realTime.location" class="location-tag">📍 {{ realTime.location }}</text>
        </view>
        <view class="status-badge" :class="realTime.device_status">
          {{ realTime.device_status === 'online' ? '设备在线' : '离线' }}
        </view>
      </view>
      
      <view class="data-grid">
        <view class="data-item">
          <text class="value">{{ realTime.temperature }}<text class="unit">℃</text></text>
          <text class="label">实时温度</text>
        </view>
        <view class="divider"></view>
        <view class="data-item">
          <text class="value">{{ realTime.humidity }}<text class="unit">%</text></text>
          <text class="label">相对湿度</text>
        </view>
      </view>

      <view class="update-time">更新时间: {{ formatDate(realTime.update_time) }}</view>
    </view>

    <!-- 报警信息 -->
    <view class="alert-section" v-if="realTime.alerts && realTime.alerts.length > 0">
      <view class="alert-item" v-for="(alert, index) in realTime.alerts" :key="index">
        <text class="icon">⚠️</text>
        <text class="msg">{{ alert.message }}</text>
      </view>
    </view>

    <!-- 历史趋势图表 (使用进度条模拟，实际可用 uCharts) -->
    <view class="chart-card">
      <view class="card-header">
        <text class="title">24小时趋势</text>
      </view>
      <view class="chart-container">
        <view class="chart-row" v-for="(item, index) in history" :key="index">
          <text class="time">{{ item.time }}</text>
          <view class="bars">
            <view class="bar-group">
              <view class="bar temp" :style="{ width: (item.temperature * 2) + '%' }"></view>
              <text class="val">{{ item.temperature }}℃</text>
            </view>
            <view class="bar-group">
              <view class="bar hum" :style="{ width: (item.humidity * 0.8) + '%' }"></view>
              <text class="val">{{ item.humidity }}%</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <button class="refresh-btn" @click="fetchData">刷新数据</button>
  </view>
</template>

<script>
import { getRealTimeData, getHistoryData } from '@/api/iot.js';

export default {
  data() {
    return {
      realTime: {
        temperature: '--',
        humidity: '--',
        update_time: new Date(),
        device_status: 'offline',
        alerts: []
      },
      history: []
    }
  },
  onShow() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.getRealTime();
      this.getHistory();
    },
    async getRealTime() {
      try {
        const res = await getRealTimeData();
        this.realTime = res;
      } catch (e) {
        console.error(e);
      }
    },
    async getHistory() {
      try {
        const res = await getHistoryData();
        this.history = res;
      } catch (e) {
        console.error(e);
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '--';
      const date = new Date(dateStr);
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2,'0')}:${String(date.getSeconds()).padStart(2,'0')}`;
    }
  }
}
</script>

<style>
.container { padding: 20rpx; background-color: #f5f5f5; min-height: 100vh; }
.monitor-card { background: linear-gradient(135deg, #2979ff, #4facfe); color: #fff; border-radius: 16rpx; padding: 40rpx; margin-bottom: 30rpx; box-shadow: 0 4rpx 20rpx rgba(41, 121, 255, 0.3); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40rpx; }
.title-group { display: flex; flex-direction: column; }
.title { font-size: 32rpx; font-weight: bold; }
.location-tag { font-size: 24rpx; opacity: 0.8; margin-top: 6rpx; }
.status-badge { font-size: 24rpx; padding: 4rpx 12rpx; border-radius: 20rpx; background: rgba(255,255,255,0.2); }
.status-badge.online { background: #4cd964; }

.data-grid { display: flex; justify-content: space-around; align-items: center; margin-bottom: 30rpx; }
.data-item { text-align: center; }
.value { font-size: 60rpx; font-weight: bold; display: block; }
.unit { font-size: 28rpx; margin-left: 4rpx; }
.label { font-size: 26rpx; opacity: 0.9; }
.divider { width: 1px; height: 60rpx; background: rgba(255,255,255,0.3); }
.update-time { text-align: center; font-size: 24rpx; opacity: 0.8; }

.alert-section { margin-bottom: 30rpx; }
.alert-item { background: #fff0f0; color: #dd524d; padding: 20rpx; border-radius: 8rpx; display: flex; align-items: center; margin-bottom: 10rpx; border: 1px solid #ffcdd2; }
.alert-item .icon { margin-right: 10rpx; }

.chart-card { background: #fff; padding: 30rpx; border-radius: 12rpx; margin-bottom: 30rpx; }
.chart-card .title { color: #333; margin-bottom: 20rpx; display: block; }
.chart-row { display: flex; align-items: center; margin-bottom: 20rpx; font-size: 24rpx; }
.time { width: 80rpx; color: #999; }
.bars { flex: 1; }
.bar-group { display: flex; align-items: center; margin-bottom: 6rpx; }
.bar { height: 16rpx; border-radius: 8rpx; transition: width 0.5s; }
.bar.temp { background: #ff9800; }
.bar.hum { background: #00bcd4; }
.val { margin-left: 10rpx; width: 60rpx; color: #666; font-size: 20rpx; }

.refresh-btn { background: #fff; color: #2979ff; border: 1px solid #2979ff; }
</style>
