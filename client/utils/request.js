/**
 * Network Request Wrapper
 * Encapsulates uni.request with automatic base URL handling, token injection, and error handling.
 */

// Default Cloud Server Address
const DEFAULT_CLOUD_SERVER = 'https://dqyrnlrtwfxe.sealoshzh.site';

/**
 * Make a network request
 * @param {Object} options - Request options
 * @param {string} options.url - API endpoint (e.g., '/auth/login')
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.data] - Request body or query parameters
 * @param {Object} [options.header] - Custom headers
 * @returns {Promise<any>} Response data
 */
export const request = (options) => {
	return new Promise((resolve, reject) => {
		// 1. Determine Base URL
		// Retrieve custom server address from local storage (if set for debugging)
		const storedServerAddress = uni.getStorageSync('server_ip');
		const targetServer = storedServerAddress || DEFAULT_CLOUD_SERVER;
		
		let apiBaseUrl;
		// Check if it's a full URL (Cloud/Remote) or just an IP (Local)
		if (targetServer.startsWith('http://') || targetServer.startsWith('https://')) {
			// Remove trailing slash if present
			const cleanUrl = targetServer.endsWith('/') ? targetServer.slice(0, -1) : targetServer;
			apiBaseUrl = `${cleanUrl}/api`;
		} else {
			// Assume it's a local IP address, append port 3000
			apiBaseUrl = `http://${targetServer}:3000/api`;
		}

		// 2. Get Authentication Token
		const authToken = uni.getStorageSync('token');
		
		// 3. Execute Request
		uni.request({
			url: apiBaseUrl + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: {
				'Content-Type': 'application/json',
				'Authorization': authToken ? `Bearer ${authToken}` : '', // Inject Bearer Token
				...options.header
			},
			success: (response) => {
				// Handle HTTP Status Codes
				if (response.statusCode >= 200 && response.statusCode < 300) {
					resolve(response.data);
				} else {
					// Parse Error Message
					let errorMessage = '请求失败';
					if (response.data && typeof response.data === 'object' && response.data.message) {
						errorMessage = response.data.message;
					} else if (response.statusCode === 404) {
						errorMessage = '接口不存在 (404)';
					} else if (response.statusCode === 500) {
						errorMessage = '服务器内部错误 (500)';
					}
					
					// Show Error Toast
					uni.showToast({
						title: errorMessage,
						icon: 'none'
					});
					
					// Handle 401 Unauthorized (Token Expired/Invalid)
					if (response.statusCode === 401) {
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
					
					reject(response.data || { message: errorMessage });
				}
			},
			fail: (error) => {
				console.error('Request Failed:', error);
				const failMessage = error.errMsg || '服务器连接失败';
				uni.showToast({
					title: '连接失败: ' + failMessage,
					icon: 'none',
					duration: 3000
				});
				reject(error);
			}
		});
	});
};
