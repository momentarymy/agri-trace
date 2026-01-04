<template>
	<view class="container">
		<!-- 顶部用户信息卡片 -->
		<view class="user-card">
			<view class="avatar">
				<text>{{ userInfo.username ? userInfo.username[0].toUpperCase() : 'U' }}</text>
			</view>
			<view class="info">
				<text class="username">欢迎您，{{ userInfo.username || '用户' }}</text>
				<text class="role-tag">{{ roleName }}</text>
			</view>
		</view>

		<!-- 功能菜单区域 -->
		<view class="menu-section" v-if="currentMenus.length > 0">
			<view class="section-title">功能导航</view>
			<view class="grid-container">
				<view 
					class="grid-item" 
					v-for="(item, index) in currentMenus" 
					:key="index"
					@click="handleNav(item.path)"
				>
					<view class="icon-box" :style="{ backgroundColor: item.color }">
						<text class="icon">{{ item.icon }}</text>
					</view>
					<text class="label">{{ item.label }}</text>
				</view>
			</view>
		</view>

		<!-- 常用功能 -->
		<view class="settings-section">
			<view class="settings-list">
				<view class="settings-item" @click="handleNav('/pages/user/info')">
					<view class="left">
						<image src="/static/images/个人信息.png" class="icon-img"></image>
						<text class="label">个人信息</text>
					</view>
					<text class="arrow">›</text>
				</view>
				<view class="settings-item" @click="handleNav('/pages/user/about')">
					<view class="left">
						<image src="/static/images/About software.png" class="icon-img"></image>
						<text class="label">关于软件</text>
					</view>
					<text class="arrow">›</text>
				</view>
			</view>
		</view>

		<!-- 退出登录 -->
		<button class="btn-logout" @click="handleLogout">退出登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				// 所有功能菜单定义
				allMenus: {
					// 生产端功能
					production: [
						{ label: '地块管理', icon: '🌱', color: '#4cd964', path: '/pages/farmland/list' },
						{ label: '农事记录', icon: '🚜', color: '#007aff', path: '/pages/operation/all' },
						{ label: '采摘登记', icon: '🧺', color: '#f0ad4e', path: '/pages/harvest/list' },
						{ label: '批次管理', icon: '🏷️', color: '#dd524d', path: '/pages/batch/list' },
						{ label: '质量检测', icon: '✅', color: '#9c27b0', path: '/pages/quality/list' }
					],
					// 流通端功能
					logistics: [
						{ label: '运输调度', icon: '🚚', color: '#007aff', path: '/pages/transport/list' },
						{ label: '入库出库', icon: '🏭', color: '#f0ad4e', path: '/pages/warehouse/stock' },
						{ label: '环境监控', icon: '🌡️', color: '#4cd964', path: '/pages/iot/monitor' }
					],
					// 监管/管理端功能
					admin: [
						{ label: '用户管理', icon: '👥', color: '#333333', path: '/pages/admin/users' },
						{ label: '数据统计', icon: '📊', color: '#dd524d', path: '/pages/admin/stats' },
						{ label: '溯源查询', icon: '🔍', color: '#007aff', path: '/pages/trace/search' }
					]
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
			},
			currentMenus() {
				const role = this.userInfo.role;
				let menus = [];
				
				if (role === 'farmer') {
					menus = [...this.allMenus.production];
				} else if (role === 'enterprise') {
					menus = [...this.allMenus.logistics];
				} else if (role === 'admin') {
					// 管理员拥有所有权限
					menus = [
						...this.allMenus.production,
						...this.allMenus.logistics,
						...this.allMenus.admin
					];
				} else {
					// 消费者 - 首页仅作为个人中心，功能在底部导航栏
					menus = [];
				}
				
				return menus;
			}
		},
		onShow() {
			// 检查登录状态
			const token = uni.getStorageSync('token');
			const user = uni.getStorageSync('userInfo');
			
			if (!token || !user) {
				uni.reLaunch({ url: '/pages/login/login' });
			} else {
				this.userInfo = user;
				
				// 只有消费者显示底部导航栏，其他角色隐藏
				if (this.userInfo.role === 'consumer') {
					uni.showTabBar();
				} else {
					uni.hideTabBar();
				}
			}
		},
		methods: {
			handleNav(path) {
				// 如果是 TabBar 页面，使用 switchTab
				if (path === '/pages/trace/scan' || path === '/pages/index/index') {
					uni.switchTab({
						url: path
					});
					return;
				}

				uni.navigateTo({
					url: path,
					fail: () => {
						uni.showToast({
							title: '功能开发中',
							icon: 'none'
						});
					}
				});
			},
			handleLogout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('token');
							uni.removeStorageSync('userInfo');
							uni.reLaunch({ url: '/pages/login/login' });
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding: 20px;
	}

	.user-card {
		background: #fff;
		padding: 20px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.05);

		.avatar {
			width: 60px;
			height: 60px;
			background: #007aff;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 15px;
			
			text {
				color: #fff;
				font-size: 24px;
				font-weight: bold;
			}
		}

		.info {
			display: flex;
			flex-direction: column;
			
			.username {
				font-size: 18px;
				font-weight: bold;
				color: #333;
				margin-bottom: 5px;
			}
			
			.role-tag {
				font-size: 12px;
				color: #666;
				background: #f0f0f0;
				padding: 2px 8px;
				border-radius: 10px;
				align-self: flex-start;
			}
		}
	}

	.menu-section {
		background: #fff;
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 30px;
		
		.section-title {
			font-size: 16px;
			font-weight: bold;
			margin-bottom: 20px;
			padding-left: 10px;
			border-left: 4px solid #007aff;
		}
	}

	.grid-container {
		display: flex;
		flex-wrap: wrap;
	}

	.grid-item {
		width: 25%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 20px;
		padding: 0 2px;
		
		.icon-box {
			width: 45px;
			height: 45px;
			border-radius: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 8px;
			
			.icon {
				font-size: 24px;
			}
		}
		
		.label {
			font-size: 12px;
			color: #666;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 100%;
			text-align: center;
		}
		
		&:active {
			opacity: 0.7;
		}
	}

	.btn-logout {
		background-color: #fff;
		color: #dd524d;
		border: 1px solid #dd524d;
		border-radius: 25px;
		font-size: 16px;
		margin-top: 20px;
		
		&:after {
			border: none;
		}
	}

	.settings-section {
		background: #fff;
		border-radius: 12px;
		padding: 0 20px;
		margin-bottom: 30px;
		
		.settings-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20px 0;
			border-bottom: 1px solid #f5f5f5;
			
			&:last-child {
				border-bottom: none;
			}
			
			.left {
				display: flex;
				align-items: center;
				
				.icon-img {
					width: 24px;
					height: 24px;
					margin-right: 10px;
				}
				
				.label {
					font-size: 16px;
					color: #333;
				}
			}
			
			.arrow {
				color: #ccc;
				font-size: 16px;
			}
			
			&:active {
				background-color: #f9f9f9;
			}
		}
	}
</style>
