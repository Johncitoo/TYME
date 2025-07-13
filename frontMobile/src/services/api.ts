// src/services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.105:3000'; // Cambia según tu red

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Credenciales incorrectas');
  const data = await res.json();
  if (data.token) await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('user', JSON.stringify(data));
  return data;
}

export async function getProtected(endpoint: string) {
  const token = await AsyncStorage.getItem('token');
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('No autorizado');
  return res.json();
}

// src/services/api.ts
const BACKEND_URL = 'http://192.168.1.105:3000'; // Ajusta tu IP según corresponda

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${BACKEND_URL}${path}`;
  const resp = await fetch(url, options);
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(errText || resp.statusText);
  }
  return resp.json();
}
