<template>
	<view class="container">
		<view class="scan-box">
			<image src="/static/scan_icon.png" mode="widthFix" class="scan-icon" v-if="false"></image> <!-- Placeholder if no icon -->
			<view class="scan-circle" @click="handleScan">
				<text class="icon">📷</text>
				<text class="text">点击扫码</text>
			</view>
			<view class="tip">请扫描农产品包装上的溯源二维码</view>
			
			<!-- 手动输入区域 (方便调试和无法扫码的情况) -->
			<view class="manual-input">
				<text class="divider">或</text>
				<view class="input-group">
					<input class="input" type="text" v-model="inputCode" placeholder="请输入溯源码/批次ID" />
					<button class="btn" @click="handleManualQuery">查询</button>
				</view>
			</view>
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
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-color: #2979ff;
	}
	
	.scan-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
	}
	
	.scan-circle {
		width: 150px;
		height: 150px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border: 4px solid rgba(255, 255, 255, 0.5);
		margin-bottom: 30px;
		
		&:active {
			background: rgba(255, 255, 255, 0.3);
		}
		
		.icon {
			font-size: 50px;
			margin-bottom: 10px;
		}
		
		.text {
			font-size: 18px;
			font-weight: bold;
		}
	}
	
	.tip {
		font-size: 14px;
		opacity: 0.8;
	}
	
	.manual-input {
		margin-top: 50px;
		width: 80%;
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.divider {
			color: rgba(255,255,255,0.6);
			margin-bottom: 20px;
			font-size: 14px;
		}
		
		.input-group {
			display: flex;
			width: 100%;
			background: rgba(255,255,255,0.95);
			border-radius: 30px;
			padding: 5px;
			box-shadow: 0 4px 10px rgba(0,0,0,0.1);
			
			.input {
				flex: 1;
				height: 40px;
				padding: 0 15px;
				font-size: 14px;
				color: #333;
			}
			
			.btn {
				width: 80px;
				height: 40px;
				line-height: 40px;
				background: #007aff;
				color: #fff;
				border-radius: 25px;
				font-size: 14px;
				margin: 0;
				&::after { border: none; }
			}
		}
	}
</style>
