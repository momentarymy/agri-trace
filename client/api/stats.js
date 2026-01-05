import { request } from '@/utils/request.js';

export const getDashboardStats = () => {
  return request({
    url: '/stats/dashboard',
    method: 'GET'
  });
};

// 用途：数据统计与仪表盘相关的 API 接口。
