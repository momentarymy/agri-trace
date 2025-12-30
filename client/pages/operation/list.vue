<template>
	<view class="container">
		<view class="timeline">
			<view class="timeline-item" v-for="(item, index) in list" :key="item.id">
				<view class="time-node">
					<view class="dot"></view>
					<view class="line" v-if="index < list.length - 1"></view>
				</view>
				<view class="content-card">
					<view class="header">
						<text class="type">{{ item.type }}</text>
						<text class="time">{{ formatDate(item.operate_time) }}</text>
					</view>
					<view class="desc">{{ item.description }}</view>
					<view class="images" v-if="item.images && item.images.length">
						<image 
							v-for="(img, imgIndex) in item.images" 
							:key="imgIndex" 
							:src="img" 
							mode="aspectFill"
							@click="previewImage(item.images, imgIndex)"
						></image>
					</view>
					<view class="operator">操作人：{{ item.operator }}</view>
				</view>
			</view>
			
			<view class="empty" v-if="list.length === 0">
				<text>暂无农事记录</text>
			</view>
		</view>
		
		<view class="fab-btn" @click="goAdd">
			<text class="plus">+</text>
		</view>
	</view>
</template>

<script>
	import { getOperationList } from '@/api/operation.js';
	
	export default {
		data() {
			return {
				batchId: '',
				list: []
			}
		},
		onLoad(options) {
			if (options.batchId) {
				this.batchId = options.batchId;
			}
		},
		onShow() {
			if (this.batchId) {
				this.getList();
			}
		},
		methods: {
			async getList() {
				try {
					const res = await getOperationList(this.batchId);
					this.list = res;
				} catch (e) {
					console.error(e);
				}
			},
			goAdd() {
				uni.navigateTo({
					url: `/pages/operation/add?batchId=${this.batchId}`
				});
			},
			formatDate(dateStr) {
				if (!dateStr) return '';
				const date = new Date(dateStr);
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
			},
			previewImage(urls, current) {
				uni.previewImage({
					urls: urls,
					current: current
				});
			}
		}
	}
</script>

<style lang="scss">
	.container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
	
	.timeline {
		padding-left: 10px;
		
		.timeline-item {
			display: flex;
			margin-bottom: 20px;
			
			.time-node {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right: 15px;
				width: 20px;
				
				.dot {
					width: 12px; height: 12px; background: #007aff; border-radius: 50%;
					border: 2px solid #cce4ff;
					flex-shrink: 0;
				}
				.line {
					width: 2px; background: #e0e0e0; flex: 1; margin-top: 5px;
				}
			}
			
			.content-card {
				flex: 1;
				background: #fff;
				padding: 15px;
				border-radius: 8px;
				box-shadow: 0 2px 5px rgba(0,0,0,0.05);
				
				.header {
					display: flex; justify-content: space-between; align-items: center;
					margin-bottom: 8px;
					.type { font-weight: bold; font-size: 16px; color: #333; }
					.time { font-size: 12px; color: #999; }
				}
				
				.desc { font-size: 14px; color: #666; margin-bottom: 10px; line-height: 1.5; }
				
				.images {
					display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;
					image { width: 70px; height: 70px; border-radius: 4px; }
				}
				
				.operator { font-size: 12px; color: #999; text-align: right; }
			}
		}
	}
	
	.empty { text-align: center; color: #999; padding-top: 50px; }
	
	.fab-btn {
		position: fixed; right: 30px; bottom: 50px;
		width: 50px; height: 50px;
		background: #007aff; border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		color: #fff; font-size: 30px;
		box-shadow: 0 4px 10px rgba(0,0,0,0.2);
		z-index: 100;
	}
</style>
