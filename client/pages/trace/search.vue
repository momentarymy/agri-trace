<template>
	<view class="container">
		<view class="search-box">
			<view class="input-wrapper">
				<image src="/static/images/搜索.png" class="search-icon"></image>
				<input 
					class="input" 
					v-model="keyword" 
					placeholder="请输入溯源码或批次ID" 
					confirm-type="search"
					@confirm="handleSearch"
				/>
			</view>
			<button class="btn-search" @click="handleSearch">查询</button>
		</view>
		
		<view class="history-section" v-if="history.length > 0">
			<view class="section-header">
				<text class="title">搜索历史</text>
				<text class="clear" @click="clearHistory">清空</text>
			</view>
			<view class="tags">
				<view 
					class="tag" 
					v-for="(item, index) in history" 
					:key="index"
					@click="quickSearch(item)"
				>
					{{ item }}
				</view>
			</view>
		</view>
		
		<view class="desc-card">
			<view class="title">功能说明</view>
			<view class="content">
				<view>1. 支持输入产品批次ID进行精确查询。</view>
				<view>2. 支持输入完整的溯源链接进行解析查询。</view>
				<view>3. 用于监管人员在无法扫码时的手动核查。</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				history: []
			}
		},
		onLoad() {
			const h = uni.getStorageSync('search_history');
			if (h) this.history = JSON.parse(h);
		},
		methods: {
			handleSearch() {
				if (!this.keyword) return uni.showToast({ title: '请输入内容', icon: 'none' });
				
				this.saveHistory(this.keyword);
				this.goResult(this.keyword);
			},
			quickSearch(val) {
				this.keyword = val;
				this.goResult(val);
			},
			goResult(id) {
				// 简单的 ID 提取逻辑
				let batchId = id;
				if (id.includes('id=')) {
					const match = id.match(/[?&]id=([^&]+)/);
					if (match) batchId = match[1];
				}
				
				uni.navigateTo({
					url: `/pages/trace/result?id=${batchId}`
				});
			},
			saveHistory(val) {
				let h = [...this.history];
				const idx = h.indexOf(val);
				if (idx > -1) h.splice(idx, 1);
				h.unshift(val);
				if (h.length > 10) h.length = 10;
				this.history = h;
				uni.setStorageSync('search_history', JSON.stringify(h));
			},
			clearHistory() {
				this.history = [];
				uni.removeStorageSync('search_history');
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20px;
		background-color: #f5f7fa;
		min-height: 100vh;
	}
	
	.search-box {
		display: flex;
		gap: 10px;
		margin-bottom: 30px;
		
		.input-wrapper {
			flex: 1;
			background: #fff;
			height: 44px;
			border-radius: 22px;
			display: flex;
			align-items: center;
			padding: 0 15px;
			box-shadow: 0 2px 6px rgba(0,0,0,0.05);
			
			.search-icon { 
				width: 20px; 
				height: 20px; 
				margin-right: 10px; 
			}
			.input { flex: 1; font-size: 14px; }
		}
		
		.btn-search {
			width: 80px;
			height: 44px;
			line-height: 44px;
			background: #007aff;
			color: #fff;
			font-size: 14px;
			border-radius: 22px;
			margin: 0;
		}
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15px;
		font-size: 14px;
		color: #666;
		
		.clear { color: #999; }
	}
	
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 30px;
		
		.tag {
			background: #fff;
			padding: 6px 15px;
			border-radius: 15px;
			font-size: 12px;
			color: #333;
		}
	}
	
	.desc-card {
		background: #fff;
		padding: 20px;
		border-radius: 10px;
		
		.title {
			font-weight: bold;
			margin-bottom: 10px;
			font-size: 16px;
		}
		
		.content {
			font-size: 14px;
			color: #666;
			line-height: 1.8;
		}
	}
</style>
