import { request } from '@/utils/request.js';

export const getUsers = (params) => {
  return request({
    url: '/admin/users',
    method: 'GET',
    data: params
  });
};

export const updateUserStatus = (id, status) => {
  return request({
    url: `/admin/users/${id}/status`,
    method: 'PUT',
    data: { status }
  });
};

// 用途：管理员相关操作的 API 接口。
