import { request } from '@/utils/request.js';

export const createHarvest = (data) => {
  return request({
    url: '/harvests',
    method: 'POST',
    data
  });
};

export const getHarvestList = (params) => {
  return request({
    url: '/harvests',
    method: 'GET',
    data: params
  });
};
