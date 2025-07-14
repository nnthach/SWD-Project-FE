import api from '~/config/axios';

export const getServicesAPI = async () => {
  const res = await api.get('/api/Booking/services');
  return res;
};

export const createBookingAPI = async (body) => {
  const res = await api.post('/api/Booking/bookCreate', body);
  return res;
};

export const cancelBookingAPI = async (bookingId) => {
  const res = await api.put(`/api/Booking/cancel/${bookingId}`);
  return res;
};

export const completeBookingAPI = async (bookingId) => {
  const res = await api.put(`/api/Booking/complete/${bookingId}`);
  return res;
};

export const updateBookingAPI = async (body) => {
  const res = await api.put('/api/Booking/update', body);
  return res;
};

export const getMyBookingsAPI = async () => {
  const res = await api.get('/api/Booking/my-bookings');
  return res;
};

export const getMyBookingByIdAPI = async (id) => {
  const res = await api.get(`/api/Booking/my-bookings/${id}`);
  return res;
};

export const getBookingsByStatusAPI = async (status) => {
  const res = await api.get('/api/Booking/bookings-by-status', {
    params: { status },
  });
  return res;
};
