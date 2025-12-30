<template>
	<view class="container">
		<view class="form-group">
			<view class="form-item">
				<text class="label">采摘数量</text>
				<input class="input" v-model="form.quantity" placeholder="例如: 500kg" />
			</view>
			
			<view class="form-item">
				<text class="label">产品等级</text>
				<picker @change="bindGradeChange" :range="grades">
					<view class="picker-view">{{ form.grade || '请选择等级' }}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="label">备注说明</text>
				<textarea class="textarea" v-model="form.notes" placeholder="备注信息..." />
			</view>
			
			<view class="form-item">
				<text class="label">采摘照片</text>
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
		
		<button class="btn-submit" @click="handleSubmit">确认采摘并生成档案</button>
	</view>
</template>

<script>
	import { createHarvest } from '@/api/harvest.js';
	
	export default {
		data() {
			return {
				batchId: '',
				grades: ['特级', '一级', '二级', '合格'],
				form: {
					quantity: '',
					grade: '一级',
					notes: '',
					images: [],
					operator: uni.getStorageSync('userInfo').username
				}
			}
		},
		onLoad(options) {
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
			bindGradeChange(e) {
				this.form.grade = this.grades[e.detail.value];
			},
			chooseImage() {
				uni.chooseImage({
					count: 3,
					success: (res) => {
						const tempFilePaths = res.tempFilePaths;
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
				if (!this.form.quantity) return uni.showToast({ title: '请填写数量', icon: 'none' });
				
				try {
					await createHarvest({
						batch_id: this.batchId,
						...this.form
					});
					
					uni.showToast({ title: '登记成功' });
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				} catch (e) {
					console.error(e);
				}
			}
		}
	}
</script>

<style lang="scss">
	.container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
	.form-group { background: #fff; border-radius: 8px; padding: 0 15px; margin-bottom: 20px; }
	.form-item {
		display: flex; flex-direction: column; padding: 15px 0; border-bottom: 1px solid #eee;
		&:last-child { border-bottom: none; }
		.label { font-size: 14px; color: #333; margin-bottom: 10px; font-weight: bold; }
		.input { font-size: 14px; height: 36px; }
		.picker-view { font-size: 14px; color: #333; height: 36px; line-height: 36px; }
		.textarea { width: 100%; height: 80px; font-size: 14px; padding: 5px 0; }
	}
	.img-list {
		display: flex; flex-wrap: wrap; gap: 10px;
		.img-item, .upload-btn {
			width: 80px; height: 80px; border-radius: 4px; overflow: hidden;
		}
		.upload-btn {
			border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center;
			font-size: 30px; color: #ccc;
		}
		image { width: 100%; height: 100%; }
	}
	.btn-submit {
		background: #f0ad4e; color: #fff; border-radius: 25px; font-size: 16px; margin-top: 30px;
		&:active { opacity: 0.8; }
	}
</style>
