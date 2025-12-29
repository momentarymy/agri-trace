<template>
	<view class="container" v-if="info">
		<!-- 头部产品卡片 -->
		<view class="header-card">
			<view class="status-badge">正品溯源</view>
			<view class="product-name">{{ info.product.name }}</view>
			<view class="batch-no">批次号：{{ info.product.batch_no }}</view>
			<view class="origin">
				<text class="icon">📍</text>
				<text>产地：{{ info.origin.farmland_name }}</text>
			</view>
		</view>
		
		<!-- 溯源时间轴 -->
		<view class="timeline-section">
			<view class="section-title">全流程溯源档案</view>
			
			<view class="timeline">
				<!-- 1. 种植信息 -->
				<view class="timeline-item start">
					<view class="dot green"></view>
					<view class="content">
						<view class="time">{{ info.product.planting_date }}</view>
						<view class="title">播种/定植</view>
						<view class="desc">作物开始生长，位于 {{ info.origin.location }}</view>
					</view>
				</view>
				
				<!-- 2. 农事记录 -->
				<view class="timeline-item" v-for="(op, idx) in info.timeline" :key="idx">
					<view class="dot blue"></view>
					<view class="content">
						<view class="time">{{ formatDate(op.date) }}</view>
						<view class="title">{{ op.type }}</view>
						<view class="desc">{{ op.desc }}</view>
						<view class="imgs" v-if="op.images && op.images.length">
							<image v-for="(img, i) in op.images" :key="i" :src="img" mode="aspectFill"></image>
						</view>
						<view class="operator">操作人: {{ op.operator }}</view>
					</view>
				</view>
				
				<!-- 3. 采摘上市 -->
				<view class="timeline-item end" v-if="info.harvest">
					<view class="dot orange"></view>
					<view class="content">
						<view class="time">{{ formatDate(info.harvest.time) }}</view>
						<view class="title">采摘上市</view>
						<view class="desc">
							<text>等级：{{ info.harvest.grade }}</text>
							<text style="margin-left: 10px;">数量：{{ info.harvest.quantity }}</text>
						</view>
						<view class="imgs" v-if="info.harvest.images && info.harvest.images.length">
							<image v-for="(img, i) in info.harvest.images" :key="i" :src="img" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="footer">
			<text>智慧农产品溯源系统提供技术支持</text>
		</view>
	</view>
</template>

<script>
	import { request } from '@/utils/request.js';
	
	export default {
		data() {
			return {
				id: '',
				info: null
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
				this.getTraceInfo();
			} else {
				uni.showToast({ title: '无效的溯源码', icon: 'none' });
			}
		},
		methods: {
			async getTraceInfo() {
				try {
					// 注意：这里不需要 token，因为是公开接口
					// 但我们的 request 封装默认会带 token，没关系，后端不校验即可
					// 或者我们需要修改 request.js 支持 skipAuth
					// 这里暂时直接请求
					uni.request({
						url: `http://localhost:3000/api/trace/${this.id}`,
						success: (res) => {
							if (res.statusCode === 200) {
								this.info = res.data;
							} else {
								uni.showToast({ title: '获取信息失败', icon: 'none' });
							}
						}
					});
				} catch (e) {
					console.error(e);
				}
			},
			formatDate(dateStr) {
				if (!dateStr) return '';
				const date = new Date(dateStr);
				return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
			}
		}
	}
</script>

<style lang="scss">
	.container { min-height: 100vh; background: #f8f8f8; padding-bottom: 30px; }
	
	.header-card {
		background: linear-gradient(135deg, #007aff, #00c6ff);
		color: #fff; padding: 30px 20px; border-radius: 0 0 20px 20px;
		position: relative;
		.status-badge {
			position: absolute; right: 20px; top: 20px;
			background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 15px; font-size: 12px;
		}
		.product-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
		.batch-no { font-size: 14px; opacity: 0.8; margin-bottom: 5px; }
		.origin { font-size: 14px; display: flex; align-items: center; opacity: 0.9; }
	}
	
	.timeline-section {
		padding: 20px;
		.section-title { font-size: 16px; font-weight: bold; margin-bottom: 20px; border-left: 4px solid #007aff; padding-left: 10px; }
	}
	
	.timeline {
		border-left: 2px solid #e0e0e0; margin-left: 10px; padding-left: 20px;
		.timeline-item {
			position: relative; margin-bottom: 30px;
			.dot {
				position: absolute; left: -26px; top: 0; width: 10px; height: 10px; border-radius: 50%;
				&.green { background: #4cd964; }
				&.blue { background: #007aff; }
				&.orange { background: #f0ad4e; }
			}
			.content {
				background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
				.time { font-size: 12px; color: #999; margin-bottom: 5px; }
				.title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 5px; }
				.desc { font-size: 14px; color: #666; line-height: 1.5; }
				.imgs {
					margin-top: 10px; display: flex; gap: 5px;
					image { width: 60px; height: 60px; border-radius: 4px; }
				}
				.operator { margin-top: 8px; font-size: 12px; color: #ccc; text-align: right; }
			}
		}
	}
	
	.footer { text-align: center; color: #ccc; font-size: 12px; margin-top: 20px; }
</style>
