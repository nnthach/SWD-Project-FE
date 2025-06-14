import api from '~/config/axios';

export const loginAPI = async (body) => {
  const res = await api.post('/auth/login', body);
  return res;
};

export const registerAPI = async (body) => {
  const res = await api.post('/auth/register', body);
  return res;
};

export const logoutAPI = async () => {
  const res = await api.post('/auth/logout');
  return res;
};

export const getUserInfoAPI = async () => {
  const res = await api.get(`/user/profile`);
  return res;
};
