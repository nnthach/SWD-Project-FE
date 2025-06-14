import api from '~/config/axios';

export const createServiceAPI = async (body) => {
  const res = await api.post('/services', body);
  return res;
};

export const getAllServiceAPI = async () => {
  const res = await api.get('/services');
  return res;
};
