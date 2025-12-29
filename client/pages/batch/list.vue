<template>
	<view class="container">
		<view class="card" v-for="(item, index) in list" :key="item.id">
			<view class="card-header">
				<text class="title">{{ item.crop_name }}</text>
				<text class="status-tag">{{ getStatusText(item.status) }}</text>
			</view>
			<view class="card-body">
				<view class="row">
					<text class="label">批次号：</text>
					<text class="value">{{ item.batch_no }}</text>
				</view>
				<view class="row">
					<text class="label">所属地块：</text>
					<text class="value">{{ item.farmland ? item.farmland.name : '-' }}</text>
				</view>
				<view class="row">
					<text class="label">种植时间：</text>
					<text class="value">{{ item.planting_date }}</text>
				</view>
			</view>
			<view class="card-footer">
				<button class="btn-mini outline" @click="goHistory(item.id)">查看记录</button>
				<button class="btn-mini" @click="goOperation(item.id)" v-if="item.status === 0">记录农事</button>
				<button class="btn-mini harvest" @click="goHarvest(item.id)" v-if="item.status === 0">采摘</button>
				<button class="btn-mini trace" @click="goTraceCode(item.id, item.batch_no)" v-if="item.status !== 0">溯源码</button>
			</view>
		</view>
		
		<view class="fab-btn" @click="goAdd">
			<text class="plus">+</text>
		</view>
	</view>
</template>

<script>
	import { request } from '@/utils/request.js';
	
	export default {
		data() {
			return {
				list: []
			}
		},
		onShow() {
			this.getList();
		},
		methods: {
			async getList() {
				try {
					const res = await request({ url: '/batches' });
					this.list = res;
				} catch (e) { console.error(e); }
			},
			getStatusText(status) {
				const map = { 0: '种植中', 1: '已采摘', 2: '已上市' };
				return map[status] || '未知';
			},
			goAdd() {
				uni.navigateTo({ url: '/pages/batch/add' });
			},
			goOperation(batchId) {
				uni.navigateTo({ url: `/pages/operation/add?batchId=${batchId}` });
			},
			goHistory(batchId) {
				uni.navigateTo({ url: `/pages/operation/list?batchId=${batchId}` });
			},
			goHarvest(batchId) {
				uni.navigateTo({ url: `/pages/harvest/add?batchId=${batchId}` });
			},
			goTraceCode(batchId, batchNo) {
				uni.navigateTo({ url: `/pages/trace/code?batchId=${batchId}&batchNo=${batchNo}` });
			}
		}
	}
</script>

<style lang="scss">
	.container { padding: 15px; background: #f5f7fa; min-height: 100vh; }
	.card {
		background: #fff; padding: 15px; border-radius: 8px; margin-bottom: 15px;
		.card-header { display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: bold; }
		.status-tag { font-size: 12px; color: #4cd964; background: #e8f8eb; padding: 2px 6px; border-radius: 4px; }
		.row { font-size: 14px; margin-bottom: 5px; color: #666; .value { color: #333; } }
		.card-footer { border-top: 1px dashed #eee; padding-top: 10px; text-align: right; }
		.btn-mini { 
			display: inline-block; font-size: 12px; background: #007aff; color: #fff; padding: 5px 15px; border-radius: 15px; margin-left: 10px;
			&.outline { background: #fff; color: #007aff; border: 1px solid #007aff; }
			&.harvest { background: #f0ad4e; }
			&.trace { background: #333; }
		}
	}
	.fab-btn { position: fixed; right: 30px; bottom: 50px; width: 50px; height: 50px; background: #007aff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
</style>
