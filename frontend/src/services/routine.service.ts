// frontend/src/services/rutina.service.ts

export interface RutinaEjercicioPayload {
  id_ejercicio: number;
  dia: number;
  orden: number;
  series: number;
  peso: number;
  descanso: number;
  observacion?: string;
}

export interface UpdateRutinaDto {
  nombre?: string;
  descripcion?: string;
  fecha_inicio?: string;
  id_entrenador?: number;
  ejercicios?: RutinaEjercicioPayload[];
  id_cliente?: number;  // Opcional, para asignar un cliente nuevo
}

export interface CreateRutinaDto {
  nombre: string;
  descripcion?: string;
  fecha_inicio: string; // yyyy-MM-dd
  id_entrenador: number; // puedes tomarlo de tu authStore
  ejercicios: RutinaEjercicioPayload[];
  id_cliente: number; // ID del cliente al que pertenece la rutina
}

const BASE = 'http://localhost:3000/rutinas';
const AUTH = { 
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
};

/** Crear */
export function createRutina(payload: CreateRutinaDto) {
  return fetch(BASE, {
    method: 'POST',
    headers: AUTH,
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}

/** Listar todas */
export function getAllRutinas() {
  return fetch(BASE, {
    headers: AUTH,
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}

/** Obtener por ID */
export function getRutinaById(id: number) {
  return fetch(`${BASE}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}

// Ahora (para edición)
export async function getRutinaForEdit(id: number) {
  return fetch(`${BASE}/${id}/for-edit`, {
    headers: AUTH,
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}

/** Actualizar */
export function updateRutina(id: number, payload: UpdateRutinaDto) {
  return fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: AUTH,
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}

/** Eliminar */
export function deleteRutina(id: number) {
  return fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: AUTH,
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // no content, devolvemos nada
  });
}

/** Obtener catálogo de ejercicios (queda igual) */
export function getAllEjercicios() {
  return fetch(`http://localhost:3000/ejercicios`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
}



