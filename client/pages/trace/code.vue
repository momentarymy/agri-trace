<template>
	<view class="container">
		<view class="card">
			<view class="title">溯源码生成成功</view>
			<view class="qr-box">
				<image class="qr-img" :src="qrUrl" mode="widthFix"></image>
			</view>
			<view class="tip">请将此二维码打印并粘贴在产品包装上</view>
			<view class="batch-info">
				<text>批次号：{{ batchNo }}</text>
			</view>
		</view>
		
		<button class="btn-save" @click="saveImage">保存二维码</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				batchId: '',
				batchNo: '',
				qrUrl: ''
			}
		},
		onLoad(options) {
			if (options.batchId) {
				this.batchId = options.batchId;
				this.batchNo = options.batchNo || '未知批次';
				this.generateQR();
			}
		},
		methods: {
			generateQR() {
				// 溯源结果页的地址 (假设部署在本地或某IP)
				// 实际生产环境应替换为真实域名
				// 这里为了演示，指向前端的 trace/result 页面
				// 注意：真机扫码需要局域网IP或公网域名，localhost 手机扫不到
				// 我们这里生成一个指向 "http://192.168.x.x:8080/#/pages/trace/result?id=..." 的码
				
				// 为了演示方便，我们先用一个模拟地址
				const content = `http://192.168.1.5:8080/#/pages/trace/result?id=${this.batchId}`;
				
				// 使用第三方 API 生成二维码图片
				this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(content)}`;
			},
			saveImage() {
				// #ifdef H5
				// H5 环境下，直接提示用户长按保存
				uni.showModal({
					title: '提示',
					content: '请长按图片或点击右键选择"图片另存为"来保存二维码',
					showCancel: false
				});
				return;
				// #endif

				// #ifndef H5
				// App 或小程序环境下，调用原生保存接口
				uni.downloadFile({
					url: this.qrUrl,
					success: (res) => {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								uni.showToast({ title: '保存成功' });
							},
							fail: () => {
								uni.showToast({ title: '保存失败，请检查权限', icon: 'none' });
							}
						});
					},
					fail: () => {
						uni.showToast({ title: '下载图片失败', icon: 'none' });
					}
				});
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	.container { padding: 30px; background: #333; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
	.card {
		background: #fff; width: 80%; padding: 30px 20px; border-radius: 12px; text-align: center;
		.title { font-size: 20px; font-weight: bold; margin-bottom: 20px; color: #333; }
		.qr-box { margin: 20px 0; }
		.qr-img { width: 200px; height: 200px; }
		.tip { font-size: 12px; color: #999; margin-bottom: 10px; }
		.batch-info { font-size: 14px; color: #666; background: #f5f5f5; padding: 5px; border-radius: 4px; display: inline-block; }
	}
	.btn-save {
		margin-top: 30px; width: 80%; background: #4cd964; color: #fff; border-radius: 25px;
	}
</style>
