import axios from "axios";

export const getAllClientes = async () => {
  // Ajusta la URL a la de tu backend
  const res = await axios.get("http://localhost:3000/users/clientes"); // O la ruta real de tu backend
  return res.data;
};

