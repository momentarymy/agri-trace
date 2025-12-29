<template>
	<view class="container">
		<view class="form-group">
			<view class="form-item">
				<text class="label">操作类型</text>
				<picker @change="bindTypeChange" :range="types">
					<view class="picker-view">{{ form.type || '请选择操作类型' }}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="label">操作描述</text>
				<textarea class="textarea" v-model="form.description" placeholder="例如: 使用了复合肥50kg..." />
			</view>
			
			<view class="form-item">
				<text class="label">现场照片</text>
				<view class="img-list">
					<view class="img-item" v-for="(img, idx) in form.images" :key="idx">
						<image :src="img" mode="aspectFill"></image>
					</view>
					<view class="upload-btn" @click="chooseImage">
						<text>+</text>
					</view>
				</view>
			</view>
		</view>
		
		<button class="btn-submit" @click="handleSubmit">提交记录</button>
	</view>
</template>

<script>
	import { request } from '@/utils/request.js';
	
	export default {
		data() {
			return {
				batchId: '',
				types: ['施肥', '浇水', '除草', '打药', '修剪', '其他'],
				form: {
					type: '',
					description: '',
					images: [],
					operator: uni.getStorageSync('userInfo').username
				}
			}
		},
		onLoad(options) {
			console.log('Page onLoad options:', options); // 调试日志
			if (options.batchId) {
				this.batchId = options.batchId;
			} else {
				uni.showModal({
					title: '错误',
					content: '参数丢失，请从批次列表页进入',
					showCancel: false,
					success: () => {
						uni.navigateBack();
					}
				});
			}
		},
		methods: {
			bindTypeChange(e) {
				this.form.type = this.types[e.detail.value];
			},
			chooseImage() {
				uni.chooseImage({
					count: 3,
					success: (res) => {
						const tempFilePaths = res.tempFilePaths;
						// 循环上传
						tempFilePaths.forEach(path => {
							this.uploadFile(path);
						});
					}
				});
			},
			uploadFile(filePath) {
				uni.uploadFile({
					url: 'http://localhost:3000/api/upload/image',
					filePath: filePath,
					name: 'file',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync('token')
					},
					success: (uploadFileRes) => {
						const data = JSON.parse(uploadFileRes.data);
						this.form.images.push(data.url);
					}
				});
			},
			async handleSubmit() {
				if (!this.form.type) return uni.showToast({ title: '请选择类型', icon: 'none' });
				
				// 确保 batchId 存在
				if (!this.batchId) return uni.showToast({ title: '批次ID丢失', icon: 'none' });

				await request({
					url: '/operations',
					method: 'POST',
					data: {
						batch_id: parseInt(this.batchId), // 确保转为数字
						...this.form
					}
				});
				
				uni.showToast({ title: '记录成功' });
				setTimeout(() => uni.navigateBack(), 1000);
			}
		}
	}
</script>

<style lang="scss">
	.container { padding: 20px; background: #fff; min-height: 100vh; }
	.form-item { margin-bottom: 20px; .label { display: block; margin-bottom: 8px; font-weight: bold; } }
	.picker-view { width: 100%; height: 44px; background: #f8f8f8; border-radius: 8px; padding: 0 15px; line-height: 44px; }
	.textarea { width: 100%; height: 100px; background: #f8f8f8; border-radius: 8px; padding: 10px; box-sizing: border-box; }
	
	.img-list { display: flex; flex-wrap: wrap; }
	.img-item, .upload-btn { width: 80px; height: 80px; margin-right: 10px; margin-bottom: 10px; border-radius: 8px; overflow: hidden; }
	.img-item image { width: 100%; height: 100%; }
	.upload-btn { background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 30px; color: #999; }
	
	.btn-submit { background: #007aff; color: #fff; border-radius: 22px; margin-top: 40px; }
</style>
