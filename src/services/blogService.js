import api from '~/config/axios';

/**
 * Get all blogs
 * @returns {Promise} API response
 */
export const getAllBlogsAPI = async () => {
  const res = await api.get('/api/Blogs');
  return res;
};

/**
 * Create a new blog
 * @param {Object} body - Blog data to create
 * @returns {Promise} API response
 */
export const createBlogAPI = async (body) => {
  const res = await api.post('/api/Blogs', body);
  return res;
};

/**
 * Get blog by ID
 * @param {string|number} id - Blog ID
 * @returns {Promise} API response
 */
export const getBlogByIdAPI = async (id) => {
  const res = await api.get(`/api/Blogs/${id}`);
  return res;
};

/**
 * Update blog by ID
 * @param {string|number} id - Blog ID
 * @param {Object} body - Updated blog data
 * @returns {Promise} API response
 */
export const updateBlogAPI = async (id, body) => {
  const res = await api.put(`/api/Blogs/${id}`, body);
  return res;
};

/**
 * Delete blog by ID
 * @param {string|number} id - Blog ID to delete
 * @returns {Promise} API response
 */
export const deleteBlogAPI = async (id) => {
  const res = await api.delete(`/api/Blogs/${id}`);
  return res;
};
