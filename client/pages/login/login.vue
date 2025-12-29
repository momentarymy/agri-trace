<template>
	<view class="container">
		<view class="header">
			<text class="title">智慧农产品溯源</text>
			<text class="subtitle">全链路数字化监管平台</text>
		</view>
		
		<view class="form-box">
			<view class="input-group">
				<text class="label">账号</text>
				<input class="input" v-model="username" placeholder="请输入用户名" />
			</view>
			
			<view class="input-group">
				<text class="label">密码</text>
				<input class="input" type="password" v-model="password" placeholder="请输入密码" />
			</view>
			
			<button class="btn-login" @click="handleLogin">登 录</button>
			
			<view class="links">
				<text @click="handleRegister">注册新账号</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { request } from '@/utils/request.js';
	
	export default {
		data() {
			return {
				username: '',
				password: ''
			}
		},
		methods: {
			async handleLogin() {
				if (!this.username || !this.password) {
					return uni.showToast({ title: '请填写完整', icon: 'none' });
				}
				
				try {
					const res = await request({
						url: '/auth/login',
						method: 'POST',
						data: {
							username: this.username,
							password: this.password
						}
					});
					
					// 登录成功
					uni.showToast({ title: '登录成功' });
					
					// 存储 Token 和用户信息
					uni.setStorageSync('token', res.token);
					uni.setStorageSync('userInfo', res.user);
					
					// 跳转到首页
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/index/index'
						});
					}, 1000);
					
				} catch (e) {
					// 错误已经在 request.js 中处理了
					console.error(e);
				}
			},
			handleRegister() {
				if (!this.username || !this.password) {
					return uni.showToast({ title: '请先输入账号密码', icon: 'none' });
				}

				const roles = [
					{ name: '种植农户', value: 'farmer' },
					{ name: '物流/加工企业', value: 'enterprise' },
					{ name: '系统管理员', value: 'admin' },
					{ name: '消费者', value: 'consumer' }
				];

				uni.showActionSheet({
					itemList: roles.map(r => r.name),
					success: (res) => {
						const selectedRole = roles[res.tapIndex].value;
						this.doRegister(selectedRole);
					}
				});
			},
			async doRegister(role) {
				try {
					await request({
						url: '/auth/register',
						method: 'POST',
						data: {
							username: this.username,
							password: this.password,
							role: role
						}
					});
					uni.showToast({ title: '注册成功，请登录' });
				} catch (e) {
					console.error(e);
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 50px 30px;
		background-color: #f8f9fa;
		min-height: 100vh;
	}
	
	.header {
		margin-bottom: 50px;
		text-align: center;
		
		.title {
			display: block;
			font-size: 28px;
			font-weight: bold;
			color: #333;
			margin-bottom: 10px;
		}
		
		.subtitle {
			font-size: 14px;
			color: #666;
		}
	}
	
	.form-box {
		background: #fff;
		padding: 30px;
		border-radius: 10px;
		box-shadow: 0 4px 12px rgba(0,0,0,0.05);
	}
	
	.input-group {
		margin-bottom: 20px;
		
		.label {
			display: block;
			font-size: 14px;
			color: #333;
			margin-bottom: 8px;
		}
		
		.input {
			width: 100%;
			height: 40px;
			border: 1px solid #ddd;
			border-radius: 4px;
			padding: 0 10px;
			font-size: 14px;
			box-sizing: border-box; // 确保 padding 不撑大宽度
		}
	}
	
	.btn-login {
		background-color: #007aff;
		color: #fff;
		border-radius: 20px;
		margin-top: 30px;
		font-size: 16px;
		
		&:active {
			opacity: 0.8;
		}
	}
	
	.links {
		margin-top: 20px;
		text-align: center;
		font-size: 14px;
		color: #007aff;
	}
</style>
