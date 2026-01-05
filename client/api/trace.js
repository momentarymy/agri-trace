import { request } from '@/utils/request.js';

export const getTraceInfo = (id) => {
  // 溯源信息通常是公开的，可能不需要 token，但这里为了统一，还是用 request
  // 如果后端接口不需要鉴权，request 带上 token 也没影响
  return request({
    url: `/trace/${id}`,
    method: 'GET'
  });
};

// 用途：产品溯源查询相关的 API 接口。
