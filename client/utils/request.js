// 封装网络请求
const BASE_URL = 'http://localhost:3000/api';

export const request = (options) => {
	return new Promise((resolve, reject) => {
		// 获取本地存储的 Token
		const token = uni.getStorageSync('token');
		
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: {
				'Content-Type': 'application/json',
				'Authorization': token ? `Bearer ${token}` : '', // 携带 Token
				...options.header
			},
			success: (res) => {
				// 判断 HTTP 状态码
				if (res.statusCode >= 200 && res.statusCode < 300) {
					resolve(res.data);
				} else {
					// 统一处理错误提示
					uni.showToast({
						title: res.data.message || '请求失败',
						icon: 'none'
					});
					
					// 如果是 401 未授权，跳转回登录页
					if (res.statusCode === 401) {
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
					
					reject(res.data);
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '服务器连接失败',
					icon: 'none'
				});
				reject(err);
			}
		});
	});
};
