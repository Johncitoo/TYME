// frontend/src/services/planApi.ts

import axios from 'axios';

export interface Plan {
  id_membresia: number;
  nombre: string;
  descripcion: string;
  precio: string;       // viene como string de JSON (TypeORM numeric)
  duracion_dias: number;
}

export interface CrearPlanPayload {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracion_dias: number;
}

// 1) Instancia axios para todo el backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  // Si usas variables de entorno de Vite, define VITE_API_BASE_URL en .env
});

// 2) Obtener todos los planes
export async function getAllPlanes(): Promise<Plan[]> {
  try {
    const res = await api.get<Plan[]>('/membresia');
    return res.data;
  } catch (error) {
    console.error('[planApi] Error en getAllPlanes:', error);
    throw error;
  }
}

// 3) Crear un plan
export async function createPlan(payload: CrearPlanPayload): Promise<Plan> {
  try {
    const res = await api.post<Plan>('/membresia', payload);
    return res.data;
  } catch (error) {
    console.error('[planApi] Error en createPlan:', error);
    throw error;
  }
}

// (Opcional) editar un plan
export async function updatePlan(id: number, cambios: Partial<CrearPlanPayload>): Promise<Plan> {
  try {
    const res = await api.put<Plan>(`/membresia/${id}`, cambios);
    return res.data;
  } catch (error) {
    console.error('[planApi] Error en updatePlan:', error);
    throw error;
  }
}

// (Opcional) borrar un plan
export async function deletePlan(id: number): Promise<void> {
  try {
    await api.delete(`/membresia/${id}`);
  } catch (error) {
    console.error('[planApi] Error en deletePlan:', error);
    throw error;
  }
}
