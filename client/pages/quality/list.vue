<template>
	<view class="container">
		<view class="card" v-for="(item, index) in list" :key="item.id">
			<view class="card-header">
				<text class="title">{{ item.check_item }}</text>
				<text class="result" :class="{ pass: item.result.includes('合格') || item.result.includes('Pass') }">{{ item.result }}</text>
			</view>
			<view class="card-body">
				<view class="row">
					<text class="label">所属批次:</text>
					<text class="value">{{ item.batch ? item.batch.crop_name : '未知' }} ({{ item.batch ? item.batch.batch_no : '' }})</text>
				</view>
                <view class="row">
					<text class="label">检测人员:</text>
					<text class="value">{{ item.inspector }}</text>
				</view>
				<view class="row">
					<text class="label">检测时间:</text>
					<text class="value">{{ formatDate(item.check_date) }}</text>
				</view>
                <view class="row" v-if="item.remarks">
					<text class="label">备注:</text>
					<text class="value">{{ item.remarks }}</text>
				</view>
			</view>
		</view>
		
		<view class="fab-btn" @click="goAdd">
			<text class="plus">+</text>
		</view>
        
        <view class="empty" v-if="list.length === 0">
			<text>暂无质检记录</text>
		</view>
	</view>
</template>

<script>
	import { getAllQualityChecks } from '@/api/quality.js';
	
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
					const res = await getAllQualityChecks();
					this.list = res;
				} catch (e) { console.error(e); }
			},
			goAdd() {
				uni.navigateTo({ url: '/pages/quality/add' });
			},
			formatDate(str) {
				if (!str) return '';
				const date = new Date(str);
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
			}
		}
	}
</script>

<style lang="scss">
	.container { padding: 15px; background: #f5f7fa; min-height: 100vh; padding-bottom: 80px; }
	.card {
		background: #fff; padding: 15px; border-radius: 8px; margin-bottom: 15px;
		box-shadow: 0 2px 5px rgba(0,0,0,0.05);
		.card-header { 
            display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 10px;
            .title { font-size: 16px; }
            .result { color: #dd524d; }
            .result.pass { color: #4cd964; }
        }
		.row { font-size: 14px; margin-bottom: 5px; color: #666; display: flex; .label { width: 80px; } .value { flex: 1; color: #333; } }
	}
	.fab-btn { position: fixed; right: 30px; bottom: 50px; width: 50px; height: 50px; background: #007aff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
    .empty { text-align: center; color: #999; margin-top: 50px; }
</style>
