import api from '~/config/axios';

export const createTestResultAPI = async (body) => {
  const res = await api.post('/TestResult', body);
  return res;
};

// export const updateServiceAPI = async (id, body) => {
//   const res = await api.put(`/services/${id}`, body);
//   return res;
// };

// export const getAllServiceAPI = async () => {
//   const res = await api.get('/services');
//   return res;
// };

// export const getServiceDetailAPI = async (id) => {
//   const res = await api.get(`/services/${id}`);
//   return res;
// };

// export const deleteServiceAPI = async (id) => {
//   const res = await api.delete(`/services/${id}`);
//   return res;
// };
