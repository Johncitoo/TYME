export class ResumenPagosDto {
  ventas_totales: number;
  pagos_totales: number;

  ventas_por_mes: {
    mes: string; // Ej: '2025-07'
    total: number;
  }[];

  ventas_por_metodo: {
    metodo: string; // Ej: 'Efectivo', 'Transferencia'
    total: number;
  }[];

  pagos_por_dia: {
    fecha: string; // Ej: '2025-07-02'
    total: number;
  }[];
}
