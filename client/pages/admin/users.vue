<template>
	<view class="container">
		<view class="tabs">
			<view 
				class="tab-item" 
				:class="{ active: currentTab === 0 }" 
				@click="switchTab(0)"
			>
				待审核申请
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentTab === 1 }" 
				@click="switchTab(1)"
			>
				全部用户
			</view>
		</view>
		
		<view class="user-list">
			<view class="empty" v-if="users.length === 0">
				<text>暂无数据</text>
			</view>
			
			<view class="user-card" v-for="user in users" :key="user.id">
				<view class="card-header">
					<text class="username">{{ user.username }}</text>
					<text class="role-badge" :class="user.role">{{ getRoleName(user.role) }}</text>
				</view>
				<view class="card-body">
					<view class="info-row">
						<text class="label">手机号:</text>
						<text class="value">{{ user.phone || '未填写' }}</text>
					</view>
					<view class="info-row">
						<text class="label">注册时间:</text>
						<text class="value">{{ formatDate(user.created_at) }}</text>
					</view>
					<view class="info-row">
						<text class="label">状态:</text>
						<text class="status-text" :class="getStatusClass(user.status)">
							{{ getStatusText(user.status) }}
						</text>
					</view>
				</view>
				<view class="card-footer" v-if="user.status === 0">
					<button class="btn btn-reject" size="mini" @click="handleStatus(user, 2)">拒绝</button>
					<button class="btn btn-approve" size="mini" @click="handleStatus(user, 1)">同意</button>
				</view>
                <view class="card-footer" v-else-if="user.status === 1 && user.role !== 'admin'">
                    <button class="btn btn-reject" size="mini" @click="handleStatus(user, 2)">禁用</button>
                </view>
                <view class="card-footer" v-else-if="user.status === 2">
                    <button class="btn btn-approve" size="mini" @click="handleStatus(user, 1)">启用</button>
                </view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getUsers, updateUserStatus } from '@/api/admin.js';
	
	export default {
		data() {
			return {
				currentTab: 0, // 0: Pending, 1: All
				users: []
			}
		},
		onShow() {
			this.fetchUsers();
		},
		methods: {
			switchTab(index) {
				this.currentTab = index;
				this.fetchUsers();
			},
			async fetchUsers() {
				try {
					const params = {};
					if (this.currentTab === 0) {
						params.status = 0;
					}
					const res = await getUsers(params);
					this.users = res;
				} catch (e) {
					console.error(e);
				}
			},
			async handleStatus(user, status) {
				const action = status === 1 ? '启用/通过' : '禁用/拒绝';
				uni.showModal({
					title: '提示',
					content: `确定要${action}该用户吗？`,
					success: async (res) => {
						if (res.confirm) {
							try {
								await updateUserStatus(user.id, status);
								uni.showToast({ title: '操作成功' });
								this.fetchUsers();
							} catch (e) {
								console.error(e);
							}
						}
					}
				});
			},
			getRoleName(role) {
				const map = {
					'admin': '管理员',
					'farmer': '种植户',
					'enterprise': '企业',
					'consumer': '消费者'
				};
				return map[role] || role;
			},
			getStatusText(status) {
				const map = {
					0: '待审核',
					1: '正常',
					2: '已禁用'
				};
				return map[status] || '未知';
			},
			getStatusClass(status) {
				if (status === 0) return 'text-warning';
				if (status === 1) return 'text-success';
				return 'text-danger';
			},
			formatDate(dateStr) {
				if (!dateStr) return '';
				const date = new Date(dateStr);
				return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
			}
		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background-color: #f5f7fa;
	}
	
	.tabs {
		display: flex;
		background: #fff;
		padding: 10px 0;
		position: sticky;
		top: 0;
		z-index: 10;
		box-shadow: 0 2px 5px rgba(0,0,0,0.05);
		
		.tab-item {
			flex: 1;
			text-align: center;
			font-size: 16px;
			padding: 10px 0;
			position: relative;
			color: #666;
			
			&.active {
				color: #007aff;
				font-weight: bold;
				
				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 30px;
					height: 3px;
					background: #007aff;
					border-radius: 2px;
				}
			}
		}
	}
	
	.user-list {
		padding: 15px;
	}
	
	.user-card {
		display: block;
		background: #fff;
		border-radius: 10px;
		padding: 15px;
		margin-bottom: 15px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.05);
		
		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10px;
			padding-bottom: 10px;
			border-bottom: 1px solid #eee;
			
			.username {
				font-size: 18px;
				font-weight: bold;
				color: #333;
			}
			
			.role-badge {
				font-size: 12px;
				padding: 2px 8px;
				border-radius: 4px;
				color: #fff;
				white-space: nowrap;
				
				&.admin { background: #333; }
				&.farmer { background: #4cd964; }
				&.enterprise { background: #007aff; }
				&.consumer { background: #f0ad4e; }
			}
		}
		
		.card-body {
			margin-bottom: 15px;
			
			.info-row {
				display: flex;
				margin-bottom: 5px;
				font-size: 14px;
				
				.label {
					color: #999;
					width: 70px;
				}
				
				.value {
					color: #333;
					flex: 1;
				}
			}
		}
		
		.card-footer {
			display: flex;
			justify-content: flex-end;
			gap: 10px;
			
			.btn {
				margin: 0;
			}
			
			.btn-approve {
				background: #007aff;
				color: #fff;
			}
			
			.btn-reject {
				background: #dd524d;
				color: #fff;
			}
		}
	}
	
	.status-text {
		&.text-warning { color: #f0ad4e; }
		&.text-success { color: #4cd964; }
		&.text-danger { color: #dd524d; }
	}
	
	.empty {
		text-align: center;
		color: #999;
		margin-top: 50px;
	}
</style>
