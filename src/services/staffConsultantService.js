import api from '~/config/axios';

export const getAllStaffConsultantAPI = async (roleId) => {
  const res = await api.get(`/staffconsultant/${roleId}`);
  return res;
};

export const getStaffConsultantDetailAPI = async (id, role) => {
  const res = await api.get(`/staffconsultant/${id}/${role}`);
  return res;
};

export const updateStaffConsultantAPI = async (id, body, role) => {
  const res = await api.put(`/staffconsultant/${id}/${role}`, body);
  return res;
};

export const deleteStaffConsultantAPI = async (id,role) => {
  const res = await api.delete(`/staffconsultant/${id}/${role}`);
  return res;
};

export const createStaffConsultantAPI = async (body) => {
  const res = await api.post('/staffconsultant', body);
  return res;
};
