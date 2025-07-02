// src/services/metodos.service.ts

import axios from 'axios';

export const getAllMetodosPago = async () => {
  const { data } = await axios.get('http://localhost:3000/tipo-metodo-pago');
  console.log('metodos:', data); // <-- prueba esto
  return data;
};
