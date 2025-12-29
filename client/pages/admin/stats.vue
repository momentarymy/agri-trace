<template>
  <view class="container">
    <!-- 顶部统计卡片 -->
    <view class="stats-grid">
      <view class="stat-card">
        <text class="stat-num">{{ stats.counts.farmlands || 0 }}</text>
        <text class="stat-label">地块总数</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">{{ stats.counts.batches || 0 }}</text>
        <text class="stat-label">生产批次</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">{{ stats.counts.operations || 0 }}</text>
        <text class="stat-label">农事记录</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">{{ stats.counts.users || 0 }}</text>
        <text class="stat-label">注册用户</text>
      </view>
    </view>

    <!-- 批次状态分布 -->
    <view class="section">
      <view class="section-title">批次状态分布</view>
      <view class="list-item" v-for="(item, index) in stats.batchStatus" :key="index">
        <text>{{ formatStatus(item.status) }}</text>
        <text class="highlight">{{ item.count }}</text>
      </view>
      <view v-if="stats.batchStatus.length === 0" class="empty-tip">暂无数据</view>
    </view>

    <!-- 热门作物 -->
    <view class="section">
      <view class="section-title">热门作物 (Top 5)</view>
      <view class="list-item" v-for="(item, index) in stats.cropDist" :key="index">
        <text>{{ item.crop_name || '未命名作物' }}</text>
        <text class="highlight">{{ item.count }} 批次</text>
      </view>
      <view v-if="stats.cropDist.length === 0" class="empty-tip">暂无数据</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      stats: {
        counts: {},
        batchStatus: [],
        cropDist: []
      }
    }
  },
  onShow() {
    this.fetchStats();
  },
  methods: {
    formatStatus(status) {
      const map = {
        0: '种植中',
        1: '已采摘',
        2: '已上市'
      };
      // status 可能是字符串或数字，统一处理
      return map[Number(status)] || `未知状态(${status})`;
    },
    async fetchStats() {
      try {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.redirectTo({ url: '/pages/login/login' });
          return;
        }
        
        const res = await uni.request({
          url: 'http://localhost:3000/api/stats/dashboard',
          method: 'GET',
          header: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.statusCode === 200) {
          this.stats = res.data;
        } else {
          console.error('获取统计失败', res);
        }
      } catch (e) {
        console.error('请求错误', e);
        uni.showToast({ title: '加载失败', icon: 'none' });
      }
    }
  }
}
</script>

<style>
.container { padding: 20rpx; background-color: #f5f5f5; min-height: 100vh; }
.stats-grid { display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 30rpx; }
.stat-card { width: 48%; background: #fff; padding: 30rpx; border-radius: 12rpx; margin-bottom: 20rpx; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.stat-num { font-size: 40rpx; font-weight: bold; color: #2979ff; margin-bottom: 10rpx; }
.stat-label { font-size: 24rpx; color: #666; }
.section { background: #fff; padding: 20rpx; border-radius: 12rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.section-title { font-size: 30rpx; font-weight: bold; margin-bottom: 20rpx; border-left: 8rpx solid #2979ff; padding-left: 15rpx; }
.list-item { display: flex; justify-content: space-between; padding: 20rpx 0; border-bottom: 1px solid #eee; font-size: 28rpx; }
.list-item:last-child { border-bottom: none; }
.highlight { color: #2979ff; font-weight: bold; }
.empty-tip { text-align: center; color: #999; padding: 20rpx; font-size: 24rpx; }
</style>
