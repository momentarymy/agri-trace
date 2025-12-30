<template>
	<view class="container">
		<!-- 列表区域 -->
		<view class="list-box">
			<view class="empty-tip" v-if="list.length === 0">
				<text>暂无地块数据，请点击右下角添加</text>
			</view>
			
			<view class="card" v-for="(item, index) in list" :key="item.id">
				<view class="card-header">
					<text class="title">{{ item.name }}</text>
					<text class="area">{{ item.area }} 亩</text>
				</view>
				<view class="card-body">
					<view class="row">
						<text class="label">位置：</text>
						<text class="value">{{ item.location || '未标注' }}</text>
					</view>
					<view class="row">
						<text class="label">创建时间：</text>
						<text class="value">{{ formatDate(item.created_at) }}</text>
					</view>
				</view>
				<view class="card-footer">
					<button class="btn-mini btn-del" @click="handleDelete(item.id)">删除</button>
				</view>
			</view>
		</view>
		
		<!-- 悬浮添加按钮 -->
		<view class="fab-btn" @click="goAdd">
			<text class="plus">+</text>
		</view>
	</view>
</template>

<script>
	import { getFarmlandList, deleteFarmland } from '@/api/farmland.js';
	
	export default {
		data() {
			return {
				list: []
			}
		},
		onShow() {
			this.getList();
		},
		methods: {
			async getList() {
				try {
					const res = await getFarmlandList();
					this.list = res;
				} catch (e) {
					console.error(e);
				}
			},
			goAdd() {
				uni.navigateTo({
					url: '/pages/farmland/add'
				});
			},
			handleDelete(id) {
				uni.showModal({
					title: '确认删除',
					content: '删除后无法恢复，确定吗？',
					success: async (res) => {
						if (res.confirm) {
							try {
								await deleteFarmland(id);
								uni.showToast({ title: '删除成功' });
								this.getList(); // 刷新列表
							} catch (e) {
								console.error(e);
							}
						}
					}
				})
			},
			formatDate(str) {
				if (!str) return '';
				return new Date(str).toLocaleDateString();
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 15px;
		background-color: #f5f7fa;
		min-height: 100vh;
		padding-bottom: 80px;
	}
	
	.empty-tip {
		text-align: center;
		color: #999;
		margin-top: 50px;
		font-size: 14px;
	}
	
	.card {
		background: #fff;
		border-radius: 8px;
		padding: 15px;
		margin-bottom: 15px;
		box-shadow: 0 2px 5px rgba(0,0,0,0.05);
		
		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #eee;
			padding-bottom: 10px;
			margin-bottom: 10px;
			
			.title {
				font-size: 16px;
				font-weight: bold;
				color: #333;
			}
			
			.area {
				font-size: 14px;
				color: #007aff;
				font-weight: bold;
			}
		}
		
		.card-body {
			.row {
				display: flex;
				margin-bottom: 8px;
				font-size: 14px;
				
				.label {
					color: #666;
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
			margin-top: 10px;
			padding-top: 10px;
			border-top: 1px dashed #eee;
			
			.btn-mini {
				font-size: 12px;
				padding: 5px 15px;
				margin: 0;
				line-height: 1.5;
				
				&.btn-del {
					background: #fff;
					color: #dd524d;
					border: 1px solid #dd524d;
				}
			}
		}
	}
	
	.fab-btn {
		position: fixed;
		right: 30px;
		bottom: 50px;
		width: 50px;
		height: 50px;
		background: #007aff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 10px rgba(0,122,255,0.3);
		
		.plus {
			color: #fff;
			font-size: 30px;
			margin-top: -4px;
		}
		
		&:active {
			transform: scale(0.95);
		}
	}
</style>
