import { apiFetch } from './api';

// Listar clases disponibles (solo futuras)
export async function getClasesDisponibles(token: string) {
  return apiFetch('/clase', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// Asistencias del cliente (clases a las que está inscrito)
export async function getMisAsistencias(token: string) {
  return apiFetch('/asistencia/mis-asistencias', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// Inscribir a clase
export async function inscribirAClase(token: string, idClase: number) {
  return apiFetch('/asistencia', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ id_clase: idClase })
  });
}

// Cancelar asistencia a clase
export async function cancelarAsistencia(token: string, idAsistencia: number) {
  return apiFetch(`/asistencia/${idAsistencia}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// Rutinas del cliente
export async function getMisRutinas(token: string, idCliente: number) {
  return apiFetch(`/rutinas/cliente/${idCliente}/todas`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
