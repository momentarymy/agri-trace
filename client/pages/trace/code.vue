<template>
	<view class="container">
		<view class="qr-card">
			<view class="title">产品溯源二维码</view>
			<view class="subtitle">扫描下方二维码查看全链路溯源信息</view>
			
			<view class="qr-box">
				<image class="qr-img" :src="qrUrl" mode="widthFix" v-if="qrUrl"></image>
				<view class="loading" v-else>生成中...</view>
			</view>
			
			<view class="info-box" v-if="batchInfo">
				<view class="row">
					<text class="label">作物名称:</text>
					<text class="value">{{ batchInfo.crop_name }}</text>
				</view>
				<view class="row">
					<text class="label">批次编号:</text>
					<text class="value">{{ batchInfo.batch_no }}</text>
				</view>
				<view class="row">
					<text class="label">生成时间:</text>
					<text class="value">{{ new Date().toLocaleDateString() }}</text>
				</view>
			</view>
			
			<button class="btn-save" @click="saveImage">保存二维码</button>
		</view>
	</view>
</template>

<script>
	import { getBatchDetail } from '@/api/batch.js';
	
	export default {
		data() {
			return {
				batchId: null,
				batchInfo: null,
				qrUrl: ''
			}
		},
		onLoad(options) {
			if (options.batchId) {
				this.batchId = options.batchId;
				this.loadData();
			}
		},
		methods: {
			async loadData() {
				try {
					const res = await getBatchDetail(this.batchId);
					this.batchInfo = res;
					this.generateQR();
				} catch (e) {
					uni.showToast({ title: '加载失败', icon: 'none' });
				}
			},
			generateQR() {
				// 实际场景中，这里应该是 H5 应用的线上地址
				// 本地开发演示使用 localhost
				// 格式: http://your-domain.com/#/pages/trace/result?id=BATCH_ID
				const baseUrl = 'http://192.168.1.5:8080'; // 请替换为你电脑的局域网IP，以便手机扫码
				const traceUrl = `${baseUrl}/#/pages/trace/result?id=${this.batchId}`;
				
				// 使用第三方 API 生成二维码图片
				this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(traceUrl)}`;
			},
			saveImage() {
				// H5 环境下提示长按保存
				// #ifdef H5
				uni.showToast({ title: '请长按图片保存', icon: 'none' });
				// #endif
				
				// #ifndef H5
				uni.downloadFile({
					url: this.qrUrl,
					success: (res) => {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								uni.showToast({ title: '保存成功' });
							},
							fail: () => {
								uni.showToast({ title: '保存失败', icon: 'none' });
							}
						});
					}
				});
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 40px 20px;
		background-color: #2979ff;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.qr-card {
		background: #fff;
		width: 100%;
		border-radius: 16px;
		padding: 40px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 10px 30px rgba(0,0,0,0.2);
		
		.title {
			font-size: 24px;
			font-weight: bold;
			color: #333;
			margin-bottom: 10px;
		}
		
		.subtitle {
			font-size: 14px;
			color: #999;
			margin-bottom: 30px;
		}
		
		.qr-box {
			width: 240px;
			height: 240px;
			margin-bottom: 30px;
			
			.qr-img {
				width: 100%;
				height: 100%;
			}
			
			.loading {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #f0f0f0;
				color: #999;
			}
		}
		
		.info-box {
			width: 100%;
			padding: 20px;
			background: #f9f9f9;
			border-radius: 8px;
			margin-bottom: 30px;
			
			.row {
				display: flex;
				justify-content: space-between;
				margin-bottom: 10px;
				font-size: 14px;
				
				&:last-child { margin-bottom: 0; }
				
				.label { color: #666; }
				.value { font-weight: bold; color: #333; }
			}
		}
		
		.btn-save {
			width: 80%;
			background: #2979ff;
			color: #fff;
			border-radius: 25px;
			font-size: 16px;
		}
	}
</style>
