<template>
	<view class="container">
		<view class="form-group">
			<view class="form-item">
				<text class="label">地块名称</text>
				<input class="input" v-model="form.name" placeholder="例如: 一号大棚" />
			</view>
			
			<view class="form-item">
				<text class="label">种植面积 (亩)</text>
				<input class="input" type="number" v-model="form.area" placeholder="请输入数字" />
			</view>
			
			<view class="form-item">
				<text class="label">地理位置</text>
				<view class="location-box">
					<input class="input" v-model="form.location" placeholder="点击右侧图标定位" />
					<text class="icon-loc" @click="getLocation">📍</text>
				</view>
			</view>
		</view>
		
		<button class="btn-submit" @click="handleSubmit">提交保存</button>
	</view>
</template>

<script>
	import { createFarmland } from '@/api/farmland.js';
	
	export default {
		data() {
			return {
				form: {
					name: '',
					area: '',
					location: ''
				}
			}
		},
		methods: {
			getLocation() {
				uni.getLocation({
					type: 'wgs84',
					success: (res) => {
						this.form.location = `经度:${res.longitude}, 纬度:${res.latitude}`;
					},
					fail: () => {
						uni.showToast({ title: '定位失败，请手动输入', icon: 'none' });
					}
				});
			},
			async handleSubmit() {
				if (!this.form.name || !this.form.area) {
					return uni.showToast({ title: '请填写必填项', icon: 'none' });
				}
				
				try {
					await createFarmland(this.form);
					
					uni.showToast({ title: '创建成功' });
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
					
				} catch (e) {
					console.error(e);
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20px;
		background-color: #fff;
		min-height: 100vh;
	}
	
	.form-group {
		margin-bottom: 30px;
	}
	
	.form-item {
		margin-bottom: 20px;
		
		.label {
			display: block;
			font-size: 14px;
			color: #333;
			margin-bottom: 8px;
			font-weight: bold;
		}
		
		.input {
			width: 100%;
			height: 44px;
			background: #f8f8f8;
			border-radius: 8px;
			padding: 0 15px;
			font-size: 14px;
			box-sizing: border-box;
		}
		
		.location-box {
			position: relative;
			
			.icon-loc {
				position: absolute;
				right: 15px;
				top: 10px;
				font-size: 20px;
				z-index: 10;
			}
		}
	}
	
	.btn-submit {
		background-color: #007aff;
		color: #fff;
		border-radius: 22px;
		font-size: 16px;
		margin-top: 40px;
		
		&:active {
			opacity: 0.8;
		}
	}
</style>
