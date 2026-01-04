<template>
	<view class="container">
		<view class="logo-section">
			<view class="logo-placeholder">
				<text class="logo-text">智</text>
			</view>
            <view class="app-name">智慧农产品溯源系统</view>
            <view class="version">Version 1.0.0</view>
		</view>
        <view class="desc-section">
            <view class="desc-title">软件介绍</view>
            <text class="desc-content">
                本系统致力于提供全流程的农产品溯源服务，从种植、生产、加工到物流运输，全方位保障食品安全。消费者可以通过扫描产品二维码，获取产品的完整生命周期信息。
            </text>
        </view>
        <view class="copyright">
            Copyright © 2023-2026 SmartAgri. All Rights Reserved.
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 40rpx;
		background-color: #fff;
		min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
	}
    .logo-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 60rpx;
        margin-top: 60rpx;
        
		.logo-placeholder {
			width: 160rpx;
			height: 160rpx;
			background: linear-gradient(135deg, #42d392 0%, #647eff 100%);
			border-radius: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 20rpx;
			box-shadow: 0 10rpx 20rpx rgba(66, 211, 146, 0.3);
			
			.logo-text {
				font-size: 80rpx;
				color: #fff;
				font-weight: bold;
			}
		}
		
        .app-name {
            font-size: 40rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 10rpx;
        }
        .version {
            font-size: 24rpx;
            color: #999;
        }
    }
    .desc-section {
        width: 100%;
        padding: 40rpx;
        background-color: #f9f9f9;
        border-radius: 20rpx;
        margin-bottom: auto;
        .desc-title {
            font-size: 32rpx;
            font-weight: bold;
            margin-bottom: 20rpx;
            color: #333;
            border-left: 8rpx solid #42d392;
            padding-left: 20rpx;
        }
        .desc-content {
            font-size: 28rpx;
            color: #666;
            line-height: 1.8;
            text-align: justify;
        }
    }
    .copyright {
        font-size: 24rpx;
        color: #ccc;
        margin-top: 40rpx;
    }
</style>