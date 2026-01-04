<template>
	<view class="container">
		<view class="form-card">
			<view class="form-item">
				<text class="label">角色</text>
				<text class="value-readonly">{{ roleName }}</text>
			</view>
			
			<view class="form-item">
				<text class="label">用户名</text>
				<input class="input" v-model="form.username" placeholder="请输入用户名" />
			</view>
		</view>

		<view class="form-card">
			<view class="section-title">修改密码 (选填)</view>
			<view class="form-item">
				<text class="label">旧密码</text>
				<input class="input" type="password" v-model="form.oldPassword" placeholder="若修改密码需输入旧密码" />
			</view>
			<view class="form-item">
				<text class="label">新密码</text>
				<input class="input" type="password" v-model="form.newPassword" placeholder="请输入新密码" />
			</view>
			<view class="form-item">
				<text class="label">确认密码</text>
				<input class="input" type="password" v-model="form.confirmPassword" placeholder="请再次输入新密码" />
			</view>
		</view>

		<button class="btn-save" @click="handleSave">保存修改</button>
	</view>
</template>

<script>
	import { updateProfile } from '@/api/auth.js';

	export default {
		data() {
			return {
				userInfo: {},
				form: {
					username: '',
					oldPassword: '',
					newPassword: '',
					confirmPassword: ''
				}
			}
		},
		computed: {
			roleName() {
				const map = {
					'admin': '系统管理员',
					'farmer': '种植农户',
					'enterprise': '物流/加工企业',
					'consumer': '消费者'
				};
				return map[this.userInfo.role] || '普通用户';
			}
		},
		onShow() {
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.userInfo = userInfo;
				this.form.username = userInfo.username;
			}
		},
		methods: {
			async handleSave() {
				if (!this.form.username) {
					return uni.showToast({ title: '用户名不能为空', icon: 'none' });
				}

				const data = {
					username: this.form.username
				};

				if (this.form.newPassword) {
					if (!this.form.oldPassword) {
						return uni.showToast({ title: '请输入旧密码', icon: 'none' });
					}
					if (this.form.newPassword !== this.form.confirmPassword) {
						return uni.showToast({ title: '两次密码不一致', icon: 'none' });
					}
					data.oldPassword = this.form.oldPassword;
					data.newPassword = this.form.newPassword;
				}

				try {
					const res = await updateProfile(data);
					uni.showToast({ title: '更新成功' });
					
					// Update local storage
					const newUserInfo = { ...this.userInfo, ...res.user };
					uni.setStorageSync('userInfo', newUserInfo);
					this.userInfo = newUserInfo;
					
					// Clear password fields
					this.form.oldPassword = '';
					this.form.newPassword = '';
					this.form.confirmPassword = '';
					
				} catch (e) {
					console.error(e);
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20rpx;
		background-color: #f5f7fa;
		min-height: 100vh;
	}
	
	.form-card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
		
		.section-title {
			font-size: 28rpx;
			color: #909399;
			padding: 20rpx 0 10rpx;
			border-bottom: 1rpx solid #f0f0f0;
		}
	}
	
	.form-item {
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #eee;
		
		&:last-child {
			border-bottom: none;
		}
		
		.label {
			width: 160rpx;
			font-size: 30rpx;
			color: #333;
		}
		
		.value-readonly {
			font-size: 28rpx;
			color: #999;
		}
		
		.input {
			flex: 1;
			font-size: 28rpx;
			color: #333;
		}
	}
	
	.btn-save {
		margin-top: 60rpx;
		background-color: #007aff;
		color: #fff;
		border-radius: 44rpx;
		font-size: 32rpx;
		
		&:active {
			opacity: 0.8;
		}
	}
</style>