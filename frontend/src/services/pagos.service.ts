// src/services/pagos.service.ts

export interface Pago {
  id_boleta: number;
  fecha_pago: string;    // "YYYY-MM-DD"
  monto: number;
  observacion?: string;
  metodo_pago: number;   // id del método
  id_cliente: number;
  id_membresia: number;
}

export interface ResumenPagos {
  ventas_totales: number;
  pagos_totales: number;
  ventas_por_mes: { mes: string; total: number }[];
  ventas_por_metodo: { metodo: string; total: number }[];
}

const API = 'http://localhost:3000';

export function getPagos(): Promise<Pago[]> {
  return fetch(`${API}/pagos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
}

export function getResumenPagos(): Promise<ResumenPagos> {
  return fetch(`${API}/pagos/resumen`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
}

export function crearPago(p: Omit<Pago, 'id_boleta'>): Promise<Pago> {
  return fetch(`${API}/pagos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(p),
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
}
