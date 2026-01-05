import { request } from '@/utils/request.js';

export const getTransportList = () => {
  return request({
    url: '/transports',
    method: 'GET'
  });
};

export const createTransport = (data) => {
  return request({
    url: '/transports',
    method: 'POST',
    data
  });
};

export const updateTransportTemp = (id, temp) => {
  return request({
    url: `/transports/${id}/temp`,
    method: 'POST',
    data: { temp }
  });
};

export const confirmTransportArrive = (id) => {
  return request({
    url: `/transports/${id}/arrive`,
    method: 'POST'
  });
};

// 用途：物流运输管理相关的 API 接口。
