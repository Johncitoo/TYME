import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000'; // Cambia si usas el móvil real

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const resp = await fetch(url, options);
  if (!resp.ok) {
    let errText;
    try { errText = (await resp.json()).message || (await resp.text()); }
    catch { errText = resp.statusText; }
    throw new Error(typeof errText === "string" ? errText : JSON.stringify(errText));
  }
  return resp.json();
}
