<template>
	<view class="container">
		<view class="header">
			<text class="title">扫码记录</text>
			<text class="clear-btn" @click="clearHistory" v-if="list.length > 0">清空</text>
		</view>
		
		<view class="list-container">
			<view class="empty" v-if="list.length === 0">
				<image src="/static/empty.png" mode="widthFix" class="empty-img" v-if="false"></image>
				<text>暂无扫码记录</text>
			</view>
			
			<view class="item" v-for="(item, index) in list" :key="index" @click="goDetail(item.batch_no)">
				<view class="icon-box">
					<text class="icon">📦</text>
				</view>
				<view class="content">
					<view class="name">{{ item.name }}</view>
					<view class="batch">批次号：{{ item.batch_no }}</view>
					<view class="info">
						<text class="time">{{ formatTime(item.time) }}</text>
						<text class="location">{{ item.location }}</text>
					</view>
				</view>
				<view class="arrow">></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		onShow() {
			this.loadHistory();
		},
		methods: {
			loadHistory() {
				try {
					const history = uni.getStorageSync('scan_history');
					if (history) {
						this.list = history;
					}
				} catch (e) {}
			},
			clearHistory() {
				uni.showModal({
					title: '提示',
					content: '确定要清空所有记录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('scan_history');
							this.list = [];
						}
					}
				});
			},
			goDetail(id) {
				uni.navigateTo({
					url: `/pages/trace/result?id=${id}`
				});
			},
			formatTime(timestamp) {
				if (!timestamp) return '';
				const date = new Date(timestamp);
				const m = (date.getMonth() + 1).toString().padStart(2, '0');
				const d = date.getDate().toString().padStart(2, '0');
				const h = date.getHours().toString().padStart(2, '0');
				const min = date.getMinutes().toString().padStart(2, '0');
				return `${m}-${d} ${h}:${min}`;
			}
		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding: 20px;
	}
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		
		.title {
			font-size: 18px;
			font-weight: bold;
			color: #333;
		}
		
		.clear-btn {
			font-size: 14px;
			color: #999;
		}
	}
	
	.list-container {
		.item {
			background: #fff;
			border-radius: 12px;
			padding: 15px;
			margin-bottom: 15px;
			display: flex;
			align-items: center;
			box-shadow: 0 2px 8px rgba(0,0,0,0.03);
			
			&:active {
				background-color: #fafafa;
			}
			
			.icon-box {
				width: 40px;
				height: 40px;
				background: #e3f2fd;
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 15px;
				
				.icon { font-size: 20px; }
			}
			
			.content {
				flex: 1;
				
				.name {
					font-size: 16px;
					font-weight: bold;
					color: #333;
					margin-bottom: 4px;
				}
				
				.batch {
					font-size: 12px;
					color: #999;
					margin-bottom: 6px;
				}
				
				.info {
					display: flex;
					justify-content: space-between;
					font-size: 12px;
					color: #666;
					
					.location {
						max-width: 120px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
			
			.arrow {
				color: #ccc;
				margin-left: 10px;
			}
		}
	}
	
	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 100px;
		color: #999;
		font-size: 14px;
	}
</style>
