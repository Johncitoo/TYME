import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleta } from '../entities/boleta.entity';
import { TipoMetodoPago } from '../entities/tipoMetodoPago.entity';
import { Cliente } from '../entities/cliente.entity';
import { Membresia } from '../entities/membresia.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Boleta)
    private readonly boletaRepo: Repository<Boleta>,
    @InjectRepository(TipoMetodoPago)
    private readonly metodoPagoRepo: Repository<TipoMetodoPago>,
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
    @InjectRepository(Membresia)
    private readonly membresiaRepo: Repository<Membresia>,
  ) {}

  /** LISTAR todas las boletas en formato plano */
  async findAll() {
    const boletas = await this.boletaRepo.find({
      relations: ['metodo_pago', 'cliente', 'membresia'],
      order: { fecha_pago: 'DESC' },
    });

    return boletas.map((b) => ({
      id_boleta: b.id_boleta,
      fecha_pago:
        typeof b.fecha_pago === 'string'
          ? b.fecha_pago
          : b.fecha_pago.toISOString().slice(0, 10),
      monto: Number(b.monto),
      observacion: b.observacion,
      metodo_pago: b.metodo_pago.nombre, // si prefieres nombre en vez de id
      id_cliente: b.cliente.id_cliente,
      id_membresia: b.membresia.id_membresia,
    }));
  }

  async resumenPagos() {
    // 1. Ventas totales y cantidad de pagos
    const total = (await this.boletaRepo
      .createQueryBuilder('b')
      .select('SUM(b.monto)', 'ventas_totales')
      .addSelect('COUNT(*)', 'pagos_totales')
      .getRawOne()) as {
      ventas_totales: string | null;
      pagos_totales: string | null;
    };

    // 2. Ventas por mes
    const ventasPorMes: Array<{ mes: string; total: string }> =
      await this.boletaRepo
        .createQueryBuilder('b')
        .select("TO_CHAR(b.fecha_pago, 'YYYY-MM')", 'mes')
        .addSelect('SUM(b.monto)', 'total')
        .groupBy("TO_CHAR(b.fecha_pago, 'YYYY-MM')")
        .orderBy('mes', 'ASC')
        .getRawMany();

    // 3. Ventas por método de pago
    const ventasPorMetodo: Array<{ metodo: string; total: string }> =
      await this.boletaRepo
        .createQueryBuilder('b')
        .leftJoin('b.metodo_pago', 'tmp')
        .select('tmp.nombre', 'metodo')
        .addSelect('SUM(b.monto)', 'total')
        .groupBy('tmp.nombre')
        .getRawMany();

    // 4. Pagos por día
    const pagosPorDiaRaw: Array<{ fecha: string; monto: string | number }> =
      await this.boletaRepo.query(`
    SELECT 
      TO_CHAR(fecha_pago, 'YYYY-MM-DD') as fecha,
      SUM(monto)::int as monto
    FROM boleta
    GROUP BY 1
    ORDER BY 1
  `);

    return {
      ventas_totales: Number(total?.ventas_totales ?? 0),
      pagos_totales: Number(total?.pagos_totales ?? 0),
      ventas_por_mes: ventasPorMes.map((v) => ({
        mes: v.mes,
        total: Number(v.total),
      })),
      ventas_por_metodo: ventasPorMetodo.map((v) => ({
        metodo: v.metodo,
        total: Number(v.total),
      })),
      pagos_por_dia: pagosPorDiaRaw.map((v) => ({
        fecha: v.fecha,
        total: Number(v.monto),
      })),
    };
  }

  async registrarPago(data: {
    fecha_pago: string;
    monto: number;
    metodo_pago: number;
    observacion?: string;
    id_cliente: number;
    id_membresia: number;
  }) {
    // Busca el método de pago
    const metodo = await this.metodoPagoRepo.findOne({
      where: { id_metodo: data.metodo_pago },
    });
    if (!metodo) throw new Error('Método de pago inválido');

    // Busca el cliente
    const cliente = await this.clienteRepo.findOne({
      where: { id_cliente: data.id_cliente },
    });
    if (!cliente) throw new Error('Cliente inválido');

    // Busca la membresía
    const membresia = await this.membresiaRepo.findOne({
      where: { id_membresia: data.id_membresia },
    });
    if (!membresia) throw new Error('Membresía inválida');

    // Crea y guarda la boleta
    const boleta = this.boletaRepo.create({
      fecha_pago: data.fecha_pago,
      monto: data.monto,
      metodo_pago: metodo,
      cliente: cliente,
      membresia: membresia,
      observacion: data.observacion ?? undefined,
    });

    return this.boletaRepo.save(boleta);
  }

  async resumenPorDia(): Promise<Array<{ fecha: string; monto: number }>> {
    return await this.boletaRepo.query(`
    SELECT 
      TO_CHAR(fecha_pago, 'YYYY-MM-DD') as fecha,
      SUM(monto)::int as monto
    FROM boleta
    GROUP BY 1
    ORDER BY 1
  `);
  }
}
