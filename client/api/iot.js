import { request } from '@/utils/request.js';

export const getRealTimeData = () => {
  return request({
    url: '/iot/realtime',
    method: 'GET'
  });
};

export const getHistoryData = () => {
  return request({
    url: '/iot/history',
    method: 'GET'
  });
};
