import api from '~/config/axios';

export const getAllBlogsAPI = async (params) => {
  const res = await api.get('/blogs', { params });
  return res;
};

export const getBlogDetailAPI = async (id) => {
  const res = await api.get(`/blogs/${id}`);
  return res;
};

export const createBlogAPI = async (body) => {
  const res = await api.post('/blogs', body);
  return res;
};

export const updateBlogAPI = async (id, body) => {
  const res = await api.put(`/blogs/${id}`, body);
  return res;
};

export const deleteBlogAPI = async (id) => {
  const res = await api.delete(`/blogs/${id}`);
  return res;
};
