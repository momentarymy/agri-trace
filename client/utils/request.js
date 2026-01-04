// 封装网络请求
// 注意：手机扫码调试时，必须将 localhost 换成电脑的局域网 IP 地址
// 并且手机和电脑必须连接同一个 Wi-Fi
// 默认 IP (当未设置自定义 IP 时使用)
const DEFAULT_IP = '10.139.199.91';

export const request = (options) => {
	return new Promise((resolve, reject) => {
		// 优先从本地存储获取自定义 IP
		const customIp = uni.getStorageSync('server_ip');
		const ip = customIp || DEFAULT_IP;
		const baseUrl = `http://${ip}:3000/api`;

		// 获取本地存储的 Token
		const token = uni.getStorageSync('token');
		
		uni.request({
			url: baseUrl + options.url,
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
					// 尝试解析错误信息
					let errorMsg = '请求失败';
					if (res.data && typeof res.data === 'object' && res.data.message) {
						errorMsg = res.data.message;
					} else if (res.statusCode === 404) {
						errorMsg = '接口不存在 (404)';
					} else if (res.statusCode === 500) {
						errorMsg = '服务器内部错误 (500)';
					}
					
					// 统一处理错误提示
					uni.showToast({
						title: errorMsg,
						icon: 'none'
					});
					
					// 如果是 401 未授权，跳转回登录页
					if (res.statusCode === 401) {
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
					
					reject(res.data || { message: errorMsg });
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
