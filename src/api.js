import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  // You can also add other default configurations for your requests here
});

/**
 * GET request
 * @param {string} url - endpoint
 * @param {object} params - query parameters
 * @param {object} headers - optional headers
 */
export const get = (url, params = {}, headers = {}) => {
  return api.get(url, { params, headers })
    .then(response => response.data)
    .catch(error => { throw error; });
};

/**
 * POST request
 * @param {string} url - endpoint
 * @param {object} data - request body
 * @param {object} headers - optional headers
 */
export const post = (url = "/api/v1", data = {}, headers = {}) => {
  return api.post(url, data, { headers })
    .then(response => response.data)
    .catch(error => { throw err.valueor; });
};

export default api;
