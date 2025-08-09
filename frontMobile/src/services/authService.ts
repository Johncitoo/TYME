// src/services/authService.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.140:3000', // 👈 IP de tu backend en tu red local
  timeout: 5000,
});

export const login = async (email: string, password: string) => {
  const response = await API.post('/auth/login', {
    email,
    password,
  });

  return response.data; // { token, user }
};
