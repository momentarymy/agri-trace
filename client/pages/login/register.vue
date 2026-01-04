<template>
	<view class="container">
		<view class="header">
			<text class="title">注册新账号</text>
			<text class="subtitle">加入智慧农产品溯源平台</text>
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

            <view class="input-group">
				<text class="label">确认密码</text>
				<input class="input" type="password" v-model="confirmPassword" placeholder="请再次输入密码" />
			</view>

			<view class="input-group">
				<text class="label">手机号</text>
				<input class="input" type="number" v-model="phone" placeholder="请输入手机号" maxlength="11" />
			</view>
			
            <view class="input-group">
				<text class="label">角色</text>
                <picker @change="bindPickerChange" :value="roleIndex" :range="roles" range-key="name">
                    <view class="picker-view">
                        {{ roles[roleIndex] ? roles[roleIndex].name : '请选择角色' }}
                    </view>
                </picker>
			</view>

			<button class="btn-login" @click="handleRegister">注 册</button>
			
			<view class="links">
				<text @click="goLogin">已有账号？去登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { register } from '@/api/auth.js';
	
	export default {
		data() {
			return {
				username: '',
				password: '',
                confirmPassword: '',
				phone: '',
                roleIndex: -1,
                roles: [
					{ name: '种植农户', value: 'farmer' },
					{ name: '物流/加工企业', value: 'enterprise' },
					{ name: '消费者', value: 'consumer' }
				]
			}
		},
		methods: {
            bindPickerChange(e) {
                this.roleIndex = e.detail.value
            },
			async handleRegister() {
				if (!this.username || !this.password) {
					return uni.showToast({ title: '请填写完整', icon: 'none' });
				}
                if (this.password !== this.confirmPassword) {
                    return uni.showToast({ title: '两次密码不一致', icon: 'none' });
                }
				if (this.phone && !/^1[3-9]\d{9}$/.test(this.phone)) {
					return uni.showToast({ title: '手机号格式不正确', icon: 'none' });
				}
                if (this.roleIndex < 0) {
                    return uni.showToast({ title: '请选择角色', icon: 'none' });
                }
				
				try {
					const res = await register({
						username: this.username,
						password: this.password,
						phone: this.phone,
                        role: this.roles[this.roleIndex].value
					});
					
                    if (res.user && res.user.status === 0) {
                        uni.showModal({
                            title: '注册申请已提交',
                            content: '您的账号需要管理员审核通过后才能登录，请耐心等待。',
                            showCancel: false,
                            success: () => {
                                uni.navigateBack();
                            }
                        });
                    } else {
                        uni.showToast({ title: '注册成功' });
                        setTimeout(() => {
                            uni.navigateBack();
                        }, 1500);
                    }
					
				} catch (e) {
					console.error(e);
				}
			},
			goLogin() {
				uni.navigateBack();
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
			box-sizing: border-box;
		}

        .picker-view {
            width: 100%;
			height: 40px;
			border: 1px solid #ddd;
			border-radius: 4px;
			padding: 0 10px;
			font-size: 14px;
			box-sizing: border-box;
            line-height: 40px;
            color: #333;
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
