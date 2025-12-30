<template>
	<view class="container">
		<view class="form-group">
			<view class="form-item">
				<text class="label">作物名称</text>
				<input class="input" v-model="form.crop_name" placeholder="例如: 草莓" />
			</view>
			<view class="form-item">
				<text class="label">选择地块</text>
				<picker @change="bindPickerChange" :value="index" :range="farmlands" range-key="name">
					<view class="picker-view">
						{{ index > -1 ? farmlands[index].name : '请选择地块' }}
					</view>
				</picker>
			</view>
			<view class="form-item">
				<text class="label">种植日期</text>
				<picker mode="date" @change="bindDateChange">
					<view class="picker-view">{{ form.planting_date || '请选择日期' }}</view>
				</picker>
			</view>
		</view>
		<button class="btn-submit" @click="handleSubmit">创建批次</button>
	</view>
</template>

<script>
	import { createBatch } from '@/api/batch.js';
	import { getFarmlandList } from '@/api/farmland.js';
	
	export default {
		data() {
			return {
				form: { crop_name: '', farmland_id: '', planting_date: '' },
				farmlands: [],
				index: -1
			}
		},
		onLoad() {
			this.getFarmlands();
		},
		methods: {
			async getFarmlands() {
				const res = await getFarmlandList();
				this.farmlands = res;
			},
			bindPickerChange(e) {
				this.index = e.detail.value;
				this.form.farmland_id = this.farmlands[this.index].id;
			},
			bindDateChange(e) {
				this.form.planting_date = e.detail.value;
			},
			async handleSubmit() {
				if(!this.form.crop_name || !this.form.farmland_id) return uni.showToast({title:'请填写完整', icon:'none'});
				await createBatch(this.form);
				uni.showToast({ title: '创建成功' });
				setTimeout(() => uni.navigateBack(), 1000);
			}
		}
	}
</script>

<style lang="scss">
	.container { padding: 20px; background: #fff; min-height: 100vh; }
	.form-item { margin-bottom: 20px; .label { display: block; margin-bottom: 8px; font-weight: bold; } }
	.input, .picker-view { width: 100%; height: 44px; background: #f8f8f8; border-radius: 8px; padding: 0 15px; line-height: 44px; font-size: 14px; }
	.btn-submit { background: #007aff; color: #fff; border-radius: 22px; margin-top: 40px; }
</style>
