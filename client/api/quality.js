import { request } from '@/utils/request.js';

export const createQualityCheck = (data) => {
  return request({
    url: '/quality',
    method: 'POST',
    data
  });
};

export const getQualityListByBatch = (batchId) => {
  return request({
    url: `/quality/batch/${batchId}`,
    method: 'GET'
  });
};

export const getAllQualityChecks = () => {
    return request({
        url: '/quality',
        method: 'GET'
    });
};
