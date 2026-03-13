import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('doctorg24_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('doctorg24_token');
      localStorage.removeItem('doctorg24_user');
    }
    return Promise.reject(err);
  }
);

// Image URL helper — adds cache-busting for fresh images
export const imgUrl = (p, bust = false) => {
  if (!p) return null;
  if (p.startsWith('http')) return p;
  const base = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
  const url = `${base}${p}`;
  // Add timestamp to bust cache when needed
  return bust ? `${url}?t=${Date.now()}` : url;
};

// YouTube ID extractor
export const getYoutubeId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  return m ? m[1] : null;
};

export default api;
