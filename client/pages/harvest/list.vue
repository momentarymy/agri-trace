<template>
	<view class="container">
		<view class="header-tip">
			<text>请选择需要采摘的批次</text>
		</view>
		
		<view class="card" v-for="(item, index) in list" :key="item.id">
			<view class="card-header">
				<text class="title">{{ item.crop_name }}</text>
				<text class="batch-no">{{ item.batch_no }}</text>
			</view>
			<view class="card-body">
				<view class="row">
					<text class="label">所属地块：</text>
					<text class="value">{{ item.farmland ? item.farmland.name : '-' }}</text>
				</view>
				<view class="row">
					<text class="label">种植时间：</text>
					<text class="value">{{ item.planting_date }}</text>
				</view>
				<view class="row">
					<text class="label">种植天数：</text>
					<text class="value highlight">{{ getDays(item.planting_date) }} 天</text>
				</view>
			</view>
			<view class="card-footer">
				<button class="btn-harvest" @click="goHarvest(item.id)">立即采摘</button>
			</view>
		</view>
		
		<view class="empty" v-if="list.length === 0">
			<text>当前没有待采摘的作物</text>
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
					// 前端过滤：只显示状态为 0 (种植中) 的批次
					this.list = res.filter(item => item.status === 0);
				} catch (e) { console.error(e); }
			},
			getDays(dateStr) {
				if (!dateStr) return 0;
				const start = new Date(dateStr);
				const now = new Date();
				const diff = now - start;
				return Math.floor(diff / (1000 * 60 * 60 * 24));
			},
			goHarvest(batchId) {
				uni.navigateTo({ url: `/pages/harvest/add?batchId=${batchId}` });
			}
		}
	}
</script>

<style lang="scss">
	.container { padding: 15px; background: #f5f7fa; min-height: 100vh; }
	
	.header-tip {
		padding: 10px 5px; color: #666; font-size: 14px;
	}
	
	.card {
		background: #fff; padding: 20px; border-radius: 12px; margin-bottom: 15px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.05);
		
		.card-header { 
			display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; 
			border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;
			.title { font-size: 18px; font-weight: bold; color: #333; }
			.batch-no { font-size: 12px; color: #999; }
		}
		
		.row { 
			display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; 
			.label { color: #666; }
			.value { color: #333; font-weight: 500; }
			.highlight { color: #ff9900; font-weight: bold; }
		}
		
		.card-footer { margin-top: 20px; }
		
		.btn-harvest {
			background: linear-gradient(to right, #f0ad4e, #ff9900);
			color: #fff; border-radius: 25px; font-size: 16px; border: none;
			box-shadow: 0 4px 10px rgba(240, 173, 78, 0.3);
			&:active { opacity: 0.9; transform: translateY(1px); }
		}
	}
	
	.empty { text-align: center; color: #999; padding-top: 50px; }
</style>
