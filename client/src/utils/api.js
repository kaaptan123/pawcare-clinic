import axios from 'axios';
export const BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
export const imgUrl = (p) => { if (!p) return null; if (p?.startsWith('http')) return p; return `${BASE_URL}${p}`; };
export const getYoutubeId = (url) => { const m = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?\s]+)/); return m?.[1]; };

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api' });
api.interceptors.request.use(c => { const t = localStorage.getItem('pawcare_token'); if (t) c.headers.Authorization = `Bearer ${t}`; return c; });
api.interceptors.response.use(r => r, e => { if (e.response?.status === 401) { localStorage.removeItem('pawcare_token'); localStorage.removeItem('pawcare_user'); } return Promise.reject(e); });
export default api;
