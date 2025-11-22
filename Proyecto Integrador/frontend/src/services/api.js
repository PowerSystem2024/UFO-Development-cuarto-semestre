// frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ufo-fruteriayverduleria.onrender.com/api'   // ✅ AHORA SÍ COINCIDE CON EL BACKEND
});

export function setToken(token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
