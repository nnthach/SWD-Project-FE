import api from '~/config/axios';

export const getStaffScheduleDetailAPI = async (query) => {
  const res = await api.get(`/staffschedule?${query}`);
  return res;
};

export const createStaffScheduleAPI = async (body) => {
  const res = await api.post('/staffschedule', body);
  return res;
};

export const deleteStaffScheduleAPI = async (id, staffId) => {
  const res = await api.delete(`/staffschedule/${id}/${staffId}`);
  return res;
};
