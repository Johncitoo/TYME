import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rutina } from '../entities/rutina.entity';
import { Cliente } from '../entities/cliente.entity';

@Injectable()
export class RutinasService {
  constructor(
    @InjectRepository(Rutina) private rutinaRepo: Repository<Rutina>,
    @InjectRepository(Cliente) private clienteRepo: Repository<Cliente>,
  ) {}

  // Obtener la rutina activa (o más reciente) del cliente
  async obtenerRutinaCliente(usuarioId: number) {
    // Buscar cliente por el id_usuario
    const cliente = await this.clienteRepo.findOne({
      where: { usuario: { id_usuario: usuarioId } },
      relations: ['usuario'],
    });
    if (!cliente) return null;

    // Buscar la rutina activa del cliente (ajusta según tu modelo)
    // Por ejemplo, si tienes un campo 'estado' o 'activa' en la rutina:
    const rutina = await this.rutinaRepo.findOne({
      where: { cliente: { id_cliente: cliente.id_cliente }, estado: 'activa' }, // ajusta 'estado' si tienes otra lógica
      relations: ['cliente'],
      order: { id_rutina: 'DESC' }, // La más reciente, si tienes varias
    });
    return rutina || null;
  }

  // Obtener todas las rutinas del cliente
  async obtenerRutinasCliente(usuarioId: number) {
    const cliente = await this.clienteRepo.findOne({
      where: { usuario: { id_usuario: usuarioId } },
      relations: ['usuario'],
    });
    if (!cliente) return [];

    const rutinas = await this.rutinaRepo.find({
      where: { cliente: { id_cliente: cliente.id_cliente } },
      relations: ['cliente'],
      order: { id_rutina: 'DESC' },
    });
    return rutinas;
  }
}
