import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Clase } from '../entities/clase.entity';
import { Cliente } from '../entities/cliente.entity';

@Injectable()
export class ClasesService {
  constructor(
    @InjectRepository(Clase) private claseRepo: Repository<Clase>,
    @InjectRepository(Cliente) private clienteRepo: Repository<Cliente>,
  ) {}

  // Próxima clase
  async obtenerProximaClase(usuarioId: number) {
    // Busca el cliente por usuarioId
    const cliente = await this.clienteRepo.findOne({
      where: { usuario: { id_usuario: usuarioId } },
      relations: ['usuario'],
    });
    if (!cliente) return null;

    // Busca la próxima clase general (ajusta según tu modelo)
    const hoy = new Date();
    const clase = await this.claseRepo.findOne({
      where: { fecha: MoreThanOrEqual(hoy) },
      order: { fecha: 'ASC' },
    });
    return clase || null;
  }

  // Fechas de clases para calendario
  async obtenerFechasClases(usuarioId: number) {
    // Busca el cliente por usuarioId
    const cliente = await this.clienteRepo.findOne({
      where: { usuario: { id_usuario: usuarioId } },
      relations: ['usuario'],
    });
    if (!cliente) return [];

    // Busca TODAS las fechas de clases
    const clases = await this.claseRepo.find();
    return clases.map((c) => c.fecha);
  }
}
