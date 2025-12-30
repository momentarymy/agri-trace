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
				<view class="timeline-item" v-if="info.harvest">
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

				<!-- 3.5 质量检测 (新增) -->
				<view class="timeline-item" v-for="(qc, index) in info.quality" :key="'qc-'+index">
					<view class="dot red"></view>
					<view class="content">
						<view class="time">{{ formatDate(qc.date) }}</view>
						<view class="title">质量检测: {{ qc.item }}</view>
						<view class="desc">
							<view>结果：<text :style="{color: qc.result.includes('合格') ? '#4cd964' : '#dd524d', fontWeight: 'bold'}">{{ qc.result }}</text></view>
							<view>检测人：{{ qc.inspector }}</view>
							<view v-if="qc.remarks">备注：{{ qc.remarks }}</view>
						</view>
					</view>
				</view>

				<!-- 4. 物流运输 -->
				<view class="timeline-item end" v-if="info.transport">
					<view class="dot purple"></view>
					<view class="content">
						<view class="time">{{ formatDate(info.transport.start_time) }}</view>
						<view class="title">冷链运输</view>
						<view class="desc">
							<view>车辆：{{ info.transport.vehicle }}</view>
							<view>司机：{{ info.transport.driver }}</view>
							<view>路线：{{ info.transport.origin }} -> {{ info.transport.destination }}</view>
						</view>
						<!-- 温度监控图表/数据 -->
						<view class="temp-chart" v-if="info.transport.temp_logs && info.transport.temp_logs.length">
							<view class="chart-title">冷链温度监控</view>
							<view class="temp-list">
								<view class="temp-item" v-for="(log, idx) in info.transport.temp_logs" :key="idx">
									<text class="time">{{ formatDate(log.time).split(' ')[1] }}</text>
									<text class="temp">{{ log.temp }}℃</text>
								</view>
							</view>
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
	import { getTraceInfo } from '@/api/trace.js';
	
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
				this.fetchTraceInfo();
			} else {
				uni.showToast({ title: '无效的溯源码', icon: 'none' });
			}
		},
		methods: {
			async fetchTraceInfo() {
				try {
					const res = await getTraceInfo(this.id);
					this.info = res;
				} catch (e) {
					uni.showToast({ title: '获取信息失败', icon: 'none' });
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
				&.purple { background: #9c27b0; }
				&.red { background: #dd524d; }
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
				
				.temp-chart {
					margin-top: 15px; background: #f9f9f9; padding: 10px; border-radius: 4px;
					.chart-title { font-size: 12px; font-weight: bold; color: #333; margin-bottom: 5px; }
					.temp-list { display: flex; flex-wrap: wrap; gap: 10px; }
					.temp-item { 
						background: #fff; padding: 2px 6px; border-radius: 4px; border: 1px solid #eee; font-size: 12px;
						.temp { color: #007aff; margin-left: 5px; font-weight: bold; }
					}
				}
			}
		}
	}
	
	.footer { text-align: center; color: #ccc; font-size: 12px; margin-top: 20px; }
</style>
