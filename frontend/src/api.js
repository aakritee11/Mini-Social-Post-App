import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data)
};

export const postsAPI = {
  getPosts: () => API.get('/posts'),
  createPost: (data) => API.post('/posts', data),
  likePost: (postId) => API.post(`/posts/${postId}/like`),
  commentPost: (postId, text) => API.post(`/posts/${postId}/comment`, { text })
};

export default API;