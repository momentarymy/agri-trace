import { request } from '@/utils/request.js';

export const getBatchList = (params) => {
  return request({
    url: '/batches',
    method: 'GET',
    data: params
  });
};

export const createBatch = (data) => {
  return request({
    url: '/batches',
    method: 'POST',
    data
  });
};

export const getBatchDetail = (id) => {
  return request({
    url: `/batches/${id}`,
    method: 'GET'
  });
};

// 用途：生产批次管理相关的 API 接口。
