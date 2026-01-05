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

// 用途：物联网传感器数据相关的 API 接口。
