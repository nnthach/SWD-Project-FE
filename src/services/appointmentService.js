import api from '~/config/axios';

export const getAllAppointmentAPI = async (params) => {
  const res = await api.get(`/appointment?${params}`);
  return res;
};

export const getAppointmentDetailAPI = async (id) => {
  const res = await api.get(`/appointment/${id}`);
  return res;
};

export const createAppointmentAPI = async (appointmentData) => {
  try {
    const res = await api.post('/appointment', appointmentData, {
      timeout: 60000, // Override default timeout just for this request
    });
    return res.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const updateAppointmentAPI = async (id, body) => {
  const res = await api.put(`/appointment/${id}`, body);
  return res;
};

export const deleteAppointmentAPI = async (id) => {
  const res = await api.delete(`/appointment/${id}`);
  return res;
};
