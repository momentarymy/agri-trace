import { request } from '@/utils/request.js';

export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  });
};

export const register = (data) => {
  return request({
    url: '/auth/register',
    method: 'POST',
    data
  });
};

export const updateProfile = (data) => {
  return request({
    url: '/auth/update',
    method: 'PUT',
    data
  });
};
