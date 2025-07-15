import api from '~/config/axios';

export const getAllAppointmentAPI = async (query) => {
  const res = await api.get(`/appointment?${query}`);
  return res;
};

export const getAppointmentDetailAPI = async (id) => {
  const res = await api.get(`/appointment/${id}`);
  return res;
};

// export const updateStaffConsultantAPI = async (id, body) => {
//   const res = await api.put(`/staffconsultant/${id}/157f0b62-afbb-44ce-91ce-397239875df5`, body);
//   return res;
// };

// export const deleteStaffConsultantAPI = async (id) => {
//   const res = await api.delete(`/staffconsultant/${id}/157f0b62-afbb-44ce-91ce-397239875df5`);
//   return res;
// };

// export const createStaffConsultantAPI = async (body) => {
//   const res = await api.post('/staffconsultant', body);
//   return res;
// };
