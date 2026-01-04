<template>
	<view class="container">
		<!-- 顶部背景装饰 -->
		<view class="header-bg">
			<view class="title">智慧溯源</view>
			<view class="subtitle">扫码查询农产品全生命周期信息</view>
		</view>
		
		<view class="content-card">
			<!-- 扫码区域 -->
			<view class="scan-section">
				<view class="scan-btn-wrapper" @click="handleScan">
					<view class="scan-btn-pulse"></view>
					<view class="scan-btn">
						<image src="/static/images/扫码.png" mode="widthFix" class="scan-icon"></image>
					</view>
				</view>
				<text class="scan-tip">点击上方按钮扫描溯源码</text>
			</view>
			
			<!-- 手动输入区域 -->
			<view class="input-section">
				<view class="divider">
					<text class="divider-text">或手动查询</text>
				</view>
				<view class="input-box">
					<input class="input" type="text" v-model="inputCode" placeholder="请输入溯源码或批次ID" confirm-type="search" @confirm="handleManualQuery"/>
					<view class="search-btn" @click="handleManualQuery">
						<text>查询</text>
					</view>
				</view>
			</view>
			
			<!-- 历史记录入口 -->
			<view class="history-link" @click="goToHistory">
				<text class="history-icon">🕒</text>
				<text>查看扫码历史记录</text>
				<text class="arrow">›</text>
			</view>
		</view>
		
		<view class="footer">
			<text>保障食品安全 · 守护舌尖健康</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputCode: ''
			}
		},
		methods: {
			goToHistory() {
				uni.navigateTo({
					url: '/pages/trace/history'
				});
			},
			handleManualQuery() {
				if (!this.inputCode) {
					return uni.showToast({ title: '请输入溯源码', icon: 'none' });
				}
				// 尝试从URL中提取ID，或者直接使用输入的ID
				let batchId = this.inputCode;
				if (this.inputCode.includes('id=')) {
					const match = this.inputCode.match(/[?&]id=([^&]+)/);
					if (match) batchId = match[1];
				}
				
				uni.navigateTo({
					url: `/pages/trace/result?id=${batchId}`
				});
			},
			handleScan() {
				// #ifdef H5
				uni.showToast({
					title: 'H5环境请使用下方手动输入',
					icon: 'none',
					duration: 2000
				});
				// #endif
				
				// #ifndef H5
				uni.scanCode({
					success: (res) => {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						
						let batchId = '';
						
						if (res.result.includes('id=')) {
							try {
								const match = res.result.match(/[?&]id=([^&]+)/);
								if (match) {
									batchId = match[1];
								}
							} catch (e) {
								const match = res.result.match(/[?&]id=([^&]+)/);
								if (match) batchId = match[1];
							}
						} else {
							if (/^\d+$/.test(res.result)) {
								batchId = res.result;
							}
						}
						
						if (batchId) {
							uni.navigateTo({
								url: `/pages/trace/result?id=${batchId}`
							});
						} else {
							uni.showToast({
								title: '无效的溯源码',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						if (err.errMsg && !err.errMsg.includes('cancel')) {
							uni.showToast({
								title: '扫码失败，请尝试手动输入',
								icon: 'none'
							});
						}
					}
				});
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background-color: #f5f7fa;
		display: flex;
		flex-direction: column;
	}
	
	.header-bg {
		height: 300rpx;
		background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
		background: linear-gradient(135deg, #42d392 0%, #647eff 100%); /* Greenish theme */
		padding: 60rpx 40rpx;
		color: #fff;
		border-bottom-left-radius: 40rpx;
		border-bottom-right-radius: 40rpx;
		
		.title {
			font-size: 48rpx;
			font-weight: bold;
			margin-bottom: 16rpx;
		}
		
		.subtitle {
			font-size: 28rpx;
			opacity: 0.9;
		}
	}
	
	.content-card {
		flex: 1;
		margin: -100rpx 30rpx 30rpx;
		background-color: #fff;
		border-radius: 24rpx;
		box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.05);
		padding: 60rpx 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.scan-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 60rpx;
		
		.scan-btn-wrapper {
			position: relative;
			width: 240rpx;
			height: 240rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 30rpx;
		}
		
		.scan-btn {
			width: 200rpx;
			height: 200rpx;
			background: linear-gradient(135deg, #42d392 0%, #647eff 100%);
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow: 0 10rpx 30rpx rgba(66, 211, 146, 0.4);
			z-index: 2;
			
			.scan-icon {
				width: 100rpx;
				height: 100rpx;
			}
		}
		
		.scan-btn-pulse {
			position: absolute;
			width: 100%;
			height: 100%;
			background-color: rgba(66, 211, 146, 0.2);
			border-radius: 50%;
			animation: pulse 2s infinite;
			z-index: 1;
		}
		
		.scan-tip {
			font-size: 30rpx;
			color: #606266;
			font-weight: 500;
		}
	}
	
	@keyframes pulse {
		0% {
			transform: scale(0.9);
			opacity: 0.7;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.3;
		}
		100% {
			transform: scale(0.9);
			opacity: 0.7;
		}
	}
	
	.input-section {
		width: 100%;
		margin-bottom: 50rpx;
		
		.divider {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			
			&::before, &::after {
				content: '';
				flex: 1;
				height: 1px;
				background-color: #ebeef5;
			}
			
			.divider-text {
				padding: 0 20rpx;
				font-size: 26rpx;
				color: #909399;
			}
		}
		
		.input-box {
			display: flex;
			align-items: center;
			background-color: #f5f7fa;
			border-radius: 100rpx;
			padding: 10rpx 10rpx 10rpx 40rpx;
			border: 2rpx solid transparent;
			transition: all 0.3s;
			
			&:focus-within {
				border-color: #42d392;
				background-color: #fff;
			}
			
			.input {
				flex: 1;
				height: 80rpx;
				font-size: 28rpx;
			}
			
			.search-btn {
				width: 120rpx;
				height: 70rpx;
				background-color: #42d392;
				color: #fff;
				border-radius: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				margin-left: 10rpx;
			}
		}
	}
	
	.history-link {
		width: 100%;
		padding: 30rpx;
		background-color: #f9f9f9;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		color: #606266;
		font-size: 28rpx;
		
		.history-icon {
			font-size: 36rpx;
			margin-right: 20rpx;
		}
		
		.arrow {
			margin-left: auto;
			color: #c0c4cc;
		}
		
		&:active {
			background-color: #f0f0f0;
		}
	}
	
	.footer {
		padding: 40rpx;
		text-align: center;
		
		text {
			font-size: 24rpx;
			color: #c0c4cc;
		}
	}
</style>
