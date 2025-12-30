import { request } from '@/utils/request.js';

export const getDashboardStats = () => {
  return request({
    url: '/stats/dashboard',
    method: 'GET'
  });
};
