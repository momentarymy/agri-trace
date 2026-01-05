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

// 用途：用户认证（登录、注册）相关的 API 接口。
