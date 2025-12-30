import { request } from '@/utils/request.js';

export const getFarmlandList = (params) => {
  return request({
    url: '/farmlands',
    method: 'GET',
    data: params
  });
};

export const createFarmland = (data) => {
  return request({
    url: '/farmlands',
    method: 'POST',
    data
  });
};

export const deleteFarmland = (id) => {
  return request({
    url: `/farmlands/${id}`,
    method: 'DELETE'
  });
};
