import axiosInstance from '~/config/axios';

export const createBooking = async (bookingData) => {
  const res = await axiosInstance.post('/booking/bookCreate', bookingData);
  return res.data;
};
