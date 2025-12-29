<template>
	<view class="container">
		<view class="form-group">
			<view class="form-item">
				<text class="label">选择批次</text>
				<picker @change="bindBatchChange" :range="batchList" range-key="label">
					<view class="picker-view">{{ selectedBatchLabel || '请选择待运批次' }}</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="label">运输车辆</text>
				<input class="input" v-model="form.vehicle_no" placeholder="例如: 鲁A 88888" />
			</view>
			
			<view class="form-item">
				<text class="label">司机姓名</text>
				<input class="input" v-model="form.driver_name" placeholder="请输入司机姓名" />
			</view>
			
			<view class="form-item">
				<text class="label">联系电话</text>
				<input class="input" v-model="form.driver_phone" placeholder="请输入联系电话" />
			</view>
			
			<view class="form-item">
				<text class="label">目的地</text>
				<input class="input" v-model="form.destination" placeholder="例如: 北京新发地市场" />
			</view>
		</view>
		
		<button class="btn-submit" @click="handleSubmit">创建运输单</button>
	</view>
</template>

<script>
	import { request } from '@/utils/request.js';
	
	export default {
		data() {
			return {
				batchList: [],
				selectedBatchLabel: '',
				form: {
					batch_id: '',
					vehicle_no: '',
					driver_name: '',
					driver_phone: '',
					destination: ''
				}
			}
		},
		onLoad() {
			this.getBatches();
		},
		methods: {
			async getBatches() {
				try {
					const res = await request({ url: '/batches' });
					// 只能选择 "已采摘" (status=1) 的批次进行运输
					this.batchList = res
						.filter(item => item.status === 1)
						.map(item => ({
							id: item.id,
							label: `${item.crop_name} (${item.batch_no})`
						}));
				} catch (e) { console.error(e); }
			},
			bindBatchChange(e) {
				const index = e.detail.value;
				this.form.batch_id = this.batchList[index].id;
				this.selectedBatchLabel = this.batchList[index].label;
			},
			async handleSubmit() {
				if (!this.form.batch_id) return uni.showToast({ title: '请选择批次', icon: 'none' });
				if (!this.form.vehicle_no) return uni.showToast({ title: '请输入车牌号', icon: 'none' });
				
				try {
					await request({
						url: '/transports',
						method: 'POST',
						data: this.form
					});
					
					uni.showToast({ title: '调度成功' });
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				} catch (e) {
					console.error(e);
				}
			}
		}
	}
</script>

<style lang="scss">
	.container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
	.form-group { background: #fff; border-radius: 8px; padding: 0 15px; margin-bottom: 20px; }
	.form-item {
		display: flex; flex-direction: column; padding: 15px 0; border-bottom: 1px solid #eee;
		&:last-child { border-bottom: none; }
		.label { font-size: 14px; color: #333; margin-bottom: 10px; font-weight: bold; }
		.input { font-size: 14px; height: 36px; }
		.picker-view { font-size: 14px; color: #333; height: 36px; line-height: 36px; }
	}
	.btn-submit {
		background: #007aff; color: #fff; border-radius: 25px; font-size: 16px; margin-top: 30px;
	}
</style>
