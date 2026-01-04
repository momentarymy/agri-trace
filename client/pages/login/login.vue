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
			
			<!-- 服务器配置区域 -->
			<view class="server-settings">
				<text class="settings-link" @click="showSettings = !showSettings">服务器设置</text>
				<view v-if="showSettings" class="settings-box">
					<input class="input-mini" v-model="serverIp" placeholder="输入电脑IP (如 192.168.1.5)" />
					<button class="btn-mini" size="mini" @click="saveServerIp">保存IP</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { login } from '@/api/auth.js';
	
	export default {
		data() {
			return {
				username: '',
				password: '',
				showSettings: false,
				serverIp: ''
			}
		},
		onLoad() {
			// 加载已保存的 IP
			const savedIp = uni.getStorageSync('server_ip');
			if (savedIp) {
				this.serverIp = savedIp;
			}
		},
		methods: {
			saveServerIp() {
				if (this.serverIp) {
					uni.setStorageSync('server_ip', this.serverIp);
					uni.showToast({ title: 'IP已更新，请重新登录', icon: 'none' });
					this.showSettings = false;
				}
			},
			async handleLogin() {
				if (!this.username || !this.password) {
					return uni.showToast({ title: '请填写完整', icon: 'none' });
				}
				
				try {
					const res = await login({
						username: this.username,
						password: this.password
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
				uni.navigateTo({
					url: '/pages/login/register'
				});
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
	
	.server-settings {
		margin-top: 30px;
		text-align: center;
		border-top: 1px dashed #eee;
		padding-top: 20px;
		
		.settings-link {
			font-size: 12px;
			color: #999;
			text-decoration: underline;
		}
		
		.settings-box {
			margin-top: 10px;
			display: flex;
			flex-direction: column;
			gap: 10px;
			align-items: center;
			
			.input-mini {
				width: 80%;
				height: 30px;
				border: 1px solid #ddd;
				border-radius: 4px;
				font-size: 12px;
				padding: 0 5px;
				text-align: center;
			}
			
			.btn-mini {
				font-size: 12px;
				background-color: #f0f0f0;
				color: #333;
			}
		}
	}
</style>
