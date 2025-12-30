<template>
	<view class="container">
		<view class="form-group">
			<view class="form-item">
				<text class="label">选择批次</text>
				<picker @change="bindBatchChange" :range="batchList" range-key="display_name">
					<view class="picker-view">
						{{ batchIndex > -1 ? batchList[batchIndex].display_name : '请选择批次' }}
					</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="label">检测项目</text>
				<input class="input" v-model="form.check_item" placeholder="例如: 农药残留检测" />
			</view>
			
			<view class="form-item">
				<text class="label">检测结果</text>
				<input class="input" v-model="form.result" placeholder="例如: 合格 / 0.01mg/kg" />
			</view>
            
            <view class="form-item">
				<text class="label">检测人/机构</text>
				<input class="input" v-model="form.inspector" placeholder="请输入检测员姓名或机构名" />
			</view>
			
			<view class="form-item">
				<text class="label">备注说明</text>
				<textarea class="textarea" v-model="form.remarks" placeholder="可选填备注信息" />
			</view>
		</view>
		
		<button class="btn-submit" @click="handleSubmit">提交质检报告</button>
	</view>
</template>

<script>
	import { createQualityCheck } from '@/api/quality.js';
	import { getBatchList } from '@/api/batch.js';
	
	export default {
		data() {
			return {
				form: {
					batch_id: '',
					check_item: '',
					result: '',
                    inspector: '',
					remarks: ''
				},
				batchList: [],
				batchIndex: -1
			}
		},
		onLoad() {
			this.getBatches();
		},
		methods: {
			async getBatches() {
				try {
					const res = await getBatchList();
					this.batchList = res.map(item => ({
                        ...item,
                        display_name: `${item.crop_name} (${item.batch_no})`
                    }));
				} catch (e) {
					console.error(e);
				}
			},
			bindBatchChange(e) {
				this.batchIndex = e.detail.value;
				this.form.batch_id = this.batchList[this.batchIndex].id;
			},
			async handleSubmit() {
				if (!this.form.batch_id) return uni.showToast({ title: '请选择批次', icon: 'none' });
				if (!this.form.check_item) return uni.showToast({ title: '请输入检测项目', icon: 'none' });
                if (!this.form.result) return uni.showToast({ title: '请输入检测结果', icon: 'none' });
                if (!this.form.inspector) return uni.showToast({ title: '请输入检测人', icon: 'none' });
				
				try {
					await createQualityCheck(this.form);
					
					uni.showToast({ title: '登记成功' });
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				} catch (e) {
					uni.showToast({ title: '提交失败', icon: 'none' });
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
		.textarea { width: 100%; height: 80px; font-size: 14px; padding: 5px 0; }
	}
	.btn-submit {
		background: #007aff; color: #fff; border-radius: 25px; font-size: 16px; margin-top: 30px;
		&:active { opacity: 0.8; }
	}
</style>
