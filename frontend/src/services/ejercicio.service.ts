export async function getAllGrupoMuscular(): Promise<{ id: number; nombre: string }[]> {
  const res = await fetch('http://localhost:3000/tipo-grupo-muscular');
  const data: Array<{ id_grupo_muscular: number; nombre: string }> = await res.json();
  return data.map(g => ({
    id: g.id_grupo_muscular,
    nombre: g.nombre,
  }));
}

export async function getAllTipoEjercicio(): Promise<{ id: number; nombre: string }[]> {
  const res = await fetch('http://localhost:3000/tipo-ejercicio');
  const data: Array<{ id_tipo_ejercicio: number; nombre: string }> = await res.json();
  return data.map(t => ({
    id: t.id_tipo_ejercicio,
    nombre: t.nombre,
  }));
}

export async function getEjercicioById(id: number) {
  const res = await fetch(`http://localhost:3000/ejercicios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return res.json() as Promise<{
    nombre: string
    descripcion?: string
    video_url?: string
    imagen_url?: string
    grupoMuscular: { id_grupo_muscular: number }
    tipoEjercicio: { id_tipo_ejercicio: number }
  }>
}

export async function updateEjercicio(id: number, payload: EjercicioData) {
  const res = await fetch(`http://localhost:3000/ejercicios/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Error actualizando')
  return res.json()
}

interface EjercicioData {
  // Replace these properties with the actual structure of your ejercicio data
  nombre: string;
  grupoMuscularId: number;
  tipoEjercicioId: number;
  // Add other fields as needed
}

export async function createEjercicio(data: EjercicioData) {
  const res = await fetch('http://localhost:3000/ejercicios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error creando');
  return res.json();
}
