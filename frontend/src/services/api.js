import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 90000,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchFormOptions() {
  const { data } = await api.get('/options');
  return data;
}

export async function generateEventPlan(formData) {
  const { data } = await api.post('/generate', formData);
  return data;
}

export default api;
