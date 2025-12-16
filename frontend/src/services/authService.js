import api from './api';

export const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  if (data?.token) localStorage.setItem('token', data.token);
  return data;
};

export const login = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  if (data?.token) localStorage.setItem('token', data.token);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
