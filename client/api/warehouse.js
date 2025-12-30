import { request } from '@/utils/request.js';

export const getStockList = () => {
  return request({
    url: '/warehouse/stocks',
    method: 'GET'
  });
};

export const getStockLogs = () => {
  return request({
    url: '/warehouse/logs',
    method: 'GET'
  });
};

export const operateStock = (data) => {
  return request({
    url: '/warehouse/operate',
    method: 'POST',
    data
  });
};
