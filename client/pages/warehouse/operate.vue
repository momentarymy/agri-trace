<template>
  <view class="container">
    <view class="form-card">
      <view class="form-title">{{ type === 'in' ? '入库登记' : '出库登记' }}</view>
      
      <view class="form-item">
        <text class="label">选择批次</text>
        <picker @change="handleBatchChange" :value="batchIndex" :range="batches" range-key="display_name">
          <view class="picker-value">
            {{ batchIndex > -1 ? batches[batchIndex].display_name : '请选择批次' }}
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">数量 (kg)</text>
        <input class="input" type="digit" v-model="quantity" placeholder="请输入数量" />
      </view>

      <view class="form-item">
        <text class="label">备注</text>
        <input class="input" v-model="remark" placeholder="选填" />
      </view>

      <button class="submit-btn" :class="type" @click="handleSubmit">确认{{ type === 'in' ? '入库' : '出库' }}</button>
    </view>
  </view>
</template>

<script>
import { getBatchList } from '@/api/batch.js';
import { operateStock } from '@/api/warehouse.js';

export default {
  data() {
    return {
      type: 'in',
      batches: [],
      batchIndex: -1,
      quantity: '',
      remark: ''
    }
  },
  onLoad(options) {
    this.type = options.type || 'in';
    uni.setNavigationBarTitle({
      title: this.type === 'in' ? '入库操作' : '出库操作'
    });
    this.fetchBatches();
  },
  methods: {
    async fetchBatches() {
      try {
        const res = await getBatchList();
        this.batches = res.map(b => ({
          ...b,
          display_name: `${b.crop_name} (${b.batch_no})`
        }));
      } catch (e) {
        console.error(e);
      }
    },
    handleBatchChange(e) {
      this.batchIndex = e.detail.value;
    },
    async handleSubmit() {
      if (this.batchIndex < 0) {
        return uni.showToast({ title: '请选择批次', icon: 'none' });
      }
      if (!this.quantity) {
        return uni.showToast({ title: '请输入数量', icon: 'none' });
      }

      try {
        await operateStock({
          batch_id: this.batches[this.batchIndex].id,
          type: this.type,
          quantity: this.quantity,
          remark: this.remark
        });

        uni.showToast({ title: '操作成功' });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
</script>

<style>
.container { padding: 20rpx; background-color: #f5f5f5; min-height: 100vh; }
.form-card { background: #fff; padding: 30rpx; border-radius: 12rpx; }
.form-title { font-size: 36rpx; font-weight: bold; margin-bottom: 40rpx; text-align: center; }
.form-item { margin-bottom: 30rpx; }
.label { display: block; font-size: 28rpx; color: #666; margin-bottom: 10rpx; }
.picker-value, .input { border: 1px solid #ddd; padding: 20rpx; border-radius: 8rpx; font-size: 30rpx; }
.submit-btn { margin-top: 50rpx; color: #fff; }
.submit-btn.in { background-color: #4cd964; }
.submit-btn.out { background-color: #dd524d; }
</style>
