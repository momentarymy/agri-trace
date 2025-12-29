<template>
  <view class="container">
    <!-- 顶部选项卡 -->
    <view class="tabs">
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 0 }" 
        @click="currentTab = 0"
      >当前库存</view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 1 }" 
        @click="currentTab = 1"
      >出入库记录</view>
    </view>

    <!-- 库存列表 -->
    <view v-if="currentTab === 0" class="list-container">
      <view class="card" v-for="(item, index) in stocks" :key="index">
        <view class="card-header">
          <text class="crop-name">{{ item.batch ? item.batch.crop_name : '未知作物' }}</text>
          <text class="stock-num">{{ item.quantity }} {{ item.unit }}</text>
        </view>
        <view class="card-body">
          <view class="row">
            <text class="label">批次号:</text>
            <text class="value">{{ item.batch ? item.batch.batch_no : '-' }}</text>
          </view>
          <view class="row">
            <text class="label">更新时间:</text>
            <text class="value">{{ formatDate(item.updated_at) }}</text>
          </view>
        </view>
      </view>
      <view v-if="stocks.length === 0" class="empty-tip">暂无库存数据</view>
    </view>

    <!-- 记录列表 -->
    <view v-if="currentTab === 1" class="list-container">
      <view class="card" v-for="(item, index) in logs" :key="index">
        <view class="card-header">
          <text class="log-type" :class="item.type">{{ item.type === 'in' ? '入库' : '出库' }}</text>
          <text class="log-num">{{ item.type === 'in' ? '+' : '-' }}{{ item.quantity }}</text>
        </view>
        <view class="card-body">
          <view class="row">
            <text class="label">作物/批次:</text>
            <text class="value">{{ item.batch ? item.batch.crop_name : '' }} ({{ item.batch ? item.batch.batch_no : '' }})</text>
          </view>
          <view class="row">
            <text class="label">操作人:</text>
            <text class="value">{{ item.operator }}</text>
          </view>
          <view class="row">
            <text class="label">时间:</text>
            <text class="value">{{ formatDate(item.created_at) }}</text>
          </view>
          <view class="row" v-if="item.remark">
            <text class="label">备注:</text>
            <text class="value">{{ item.remark }}</text>
          </view>
        </view>
      </view>
      <view v-if="logs.length === 0" class="empty-tip">暂无记录</view>
    </view>

    <!-- 底部操作栏 -->
    <view class="footer-actions">
      <button class="btn btn-in" @click="handleOperate('in')">入库</button>
      <button class="btn btn-out" @click="handleOperate('out')">出库</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      stocks: [],
      logs: []
    }
  },
  onShow() {
    this.fetchData();
  },
  watch: {
    currentTab() {
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      const token = uni.getStorageSync('token');
      if (!token) return;

      const url = this.currentTab === 0 
        ? 'http://localhost:3000/api/warehouse/stocks'
        : 'http://localhost:3000/api/warehouse/logs';

      try {
        const res = await uni.request({
          url,
          method: 'GET',
          header: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.statusCode === 200) {
          if (this.currentTab === 0) {
            this.stocks = res.data;
          } else {
            this.logs = res.data;
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    handleOperate(type) {
      uni.navigateTo({
        url: `/pages/warehouse/operate?type=${type}`
      });
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
    }
  }
}
</script>

<style>
.container { padding-bottom: 120rpx; background-color: #f5f5f5; min-height: 100vh; }
.tabs { display: flex; background: #fff; padding: 20rpx 0; position: sticky; top: 0; z-index: 10; }
.tab-item { flex: 1; text-align: center; font-size: 30rpx; color: #666; padding-bottom: 10rpx; border-bottom: 4rpx solid transparent; }
.tab-item.active { color: #2979ff; border-bottom-color: #2979ff; font-weight: bold; }

.list-container { padding: 20rpx; }
.card { background: #fff; border-radius: 12rpx; padding: 20rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 15rpx; margin-bottom: 15rpx; }
.crop-name { font-size: 32rpx; font-weight: bold; }
.stock-num { font-size: 32rpx; color: #2979ff; font-weight: bold; }

.log-type { padding: 4rpx 12rpx; border-radius: 8rpx; font-size: 24rpx; }
.log-type.in { background: #e8f5e9; color: #4cd964; }
.log-type.out { background: #ffebee; color: #dd524d; }
.log-num { font-size: 32rpx; font-weight: bold; }

.card-body .row { display: flex; margin-bottom: 10rpx; font-size: 28rpx; }
.card-body .label { color: #999; width: 160rpx; }
.card-body .value { color: #333; flex: 1; }

.footer-actions { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 20rpx; display: flex; justify-content: space-around; box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05); }
.btn { width: 45%; font-size: 30rpx; border-radius: 40rpx; }
.btn-in { background: #4cd964; color: #fff; }
.btn-out { background: #dd524d; color: #fff; }
.empty-tip { text-align: center; color: #999; padding: 40rpx; }
</style>
