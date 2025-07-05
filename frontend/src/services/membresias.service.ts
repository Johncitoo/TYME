// src/services/membresias.service.ts

import axios from 'axios';

export const getAllMembresias = async () => {
  const { data } = await axios.get('http://localhost:3000/membresia'); // ← coincide con tu ruta activa
  return data;
};
