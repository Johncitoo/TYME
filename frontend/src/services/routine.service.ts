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

export interface CreateRutinaDto {
  nombre: string;
  descripcion?: string;
  fecha_inicio: string; // yyyy-MM-dd
  id_entrenador: number; // puedes tomarlo de tu authStore
  ejercicios: RutinaEjercicioPayload[];
  id_cliente: number; // ID del cliente al que pertenece la rutina
}

export function createRutina(payload: CreateRutinaDto) {
  return fetch(`http://localhost:3000/rutinas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}

export function getAllEjercicios() {
  return fetch(`http://localhost:3000/ejercicios`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
}

export function getRutinaById(id: number) {
  return fetch(`http://localhost:3000/rutinas/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
}

export function updateRutina(id: number, payload: CreateRutinaDto) {
  return fetch(`http://localhost:3000/rutinas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}


