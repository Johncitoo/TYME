// src/services/clienteService.ts
import { apiFetch } from './api';

// Listar clases disponibles para inscribir
export async function getClasesDisponibles(token: string) {
  return apiFetch('/clase', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// Clases inscritas del cliente
export async function getMisClases(token: string, idCliente: number) {
  return apiFetch(`/clase/cliente/${idCliente}/semana`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// Rutinas del cliente
export async function getMisRutinas(token: string, idCliente: number) {
  return apiFetch(`/rutinas/cliente/${idCliente}/todas`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
