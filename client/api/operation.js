import { request } from '@/utils/request.js';

export const getOperationList = (batchId) => {
  return request({
    url: `/operations/batch/${batchId}`,
    method: 'GET'
  });
};

export const createOperation = (data) => {
  return request({
    url: '/operations',
    method: 'POST',
    data
  });
};

export const getAllOperations = () => {
  return request({
    url: '/operations',
    method: 'GET'
  });
};

// 用途：农事操作记录相关的 API 接口。
