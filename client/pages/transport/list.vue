<template>
	<view class="container">
		<view class="card" v-for="(item, index) in list" :key="item.id" @click="goDetail(item.id)">
			<view class="card-header">
				<text class="title">{{ item.batch ? item.batch.crop_name : '未知货物' }}</text>
				<text class="status-tag" :class="{ done: item.status === 1 }">
					{{ item.status === 1 ? '已送达' : '运输中' }}
				</text>
			</view>
			<view class="card-body">
				<view class="row">
					<text class="label">车牌号：</text>
					<text class="value">{{ item.vehicle_no }}</text>
				</view>
				<view class="row">
					<text class="label">司机：</text>
					<text class="value">{{ item.driver_name }}</text>
				</view>
				<view class="row">
					<text class="label">目的地：</text>
					<text class="value">{{ item.destination }}</text>
				</view>
			</view>
		</view>
		
		<view class="fab-btn" @click="goCreate">
			<text class="plus">+</text>
		</view>
	</view>
</template>

<script>
	import { getTransportList, confirmTransportArrive } from '@/api/transport.js';
	
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
					const res = await getTransportList();
					this.list = res;
				} catch (e) { console.error(e); }
			},
			goCreate() {
				uni.navigateTo({ url: '/pages/transport/create' });
			},
			goDetail(id) {
				const item = this.list.find(i => i.id === id);
				if (item && item.status === 1) return;

				// 暂时不做详情页，直接弹窗模拟操作
				uni.showActionSheet({
					itemList: ['确认送达'],
					success: (res) => {
						if (res.tapIndex === 0) {
							this.confirmArrive(id);
						}
					}
				});
			},
			async confirmArrive(id) {
				try {
					await confirmTransportArrive(id);
					uni.showToast({ title: '已确认送达' });
					this.getList();
				} catch (e) {}
			}
		}
	}
</script>

<style lang="scss">
	.container { padding: 15px; background: #f5f7fa; min-height: 100vh; }
	.card {
		background: #fff; padding: 15px; border-radius: 8px; margin-bottom: 15px;
		.card-header { display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: bold; }
		.status-tag { 
			font-size: 12px; color: #fff; background: #007aff; padding: 2px 6px; border-radius: 4px; 
			&.done { background: #4cd964; }
		}
		.row { font-size: 14px; margin-bottom: 5px; color: #666; .value { color: #333; } }
	}
	.fab-btn { position: fixed; right: 30px; bottom: 50px; width: 50px; height: 50px; background: #007aff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
</style>
