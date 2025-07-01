// src/asistencia/asistencia.service.ts
import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from './asistencia.entity';
import { Cliente } from '../entities/cliente.entity';
import { Clase } from '../clase/clase.entity';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private readonly asistenciaRepo: Repository<Asistencia>,
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
    @InjectRepository(Clase)
    private readonly claseRepo: Repository<Clase>,
  ) {}

  async create(createDto: CreateAsistenciaDto, id_usuario: number): Promise<Asistencia> {
    // 1. Buscar el cliente por el id_usuario logeado
    const cliente = await this.clienteRepo.findOne({
      where: { usuario: { id_usuario } },
    });
    if (!cliente) throw new BadRequestException('Cliente no encontrado');

    // 2. Buscar la clase y contar asistentes
    const clase = await this.claseRepo.findOne({
      where: { id_clase: createDto.id_clase },
    });
    if (!clase) throw new BadRequestException('Clase no encontrada');

    // 2.1 Valida fecha de la clase
    if (new Date(clase.fecha_clase) < new Date(new Date().toISOString().split('T')[0])) {
      throw new BadRequestException('No puedes inscribirte en clases pasadas');
    }

    // 3. ¿Ya está inscrito?
    const yaInscrito = await this.asistenciaRepo.findOne({
      where: { cliente: { id_cliente: cliente.id_cliente }, clase: { id_clase: clase.id_clase } },
    });
    if (yaInscrito) throw new BadRequestException('Ya estás inscrito en esta clase');

    // 4. Contar inscritos actuales
    const inscritos = await this.asistenciaRepo.count({
      where: { clase: { id_clase: clase.id_clase } },
    });
    if (inscritos >= clase.cupo_maximo) {
      throw new BadRequestException('Clase sin cupos disponibles');
    }

    // 5. Crear la asistencia
    const asistencia = this.asistenciaRepo.create({
      cliente,
      clase,
      fecha: new Date().toISOString().split('T')[0],
    });
    return this.asistenciaRepo.save(asistencia);
  }

  // Listar asistencias de un cliente
  async findByCliente(id_usuario: number) {
    const cliente = await this.clienteRepo.findOne({
      where: { usuario: { id_usuario } },
    });
    if (!cliente) throw new BadRequestException('Cliente no encontrado');
    return this.asistenciaRepo.find({ where: { cliente: { id_cliente: cliente.id_cliente } } });
  }

  // Listar asistentes de una clase
  async findByClase(id_clase: number) {
    return this.asistenciaRepo.find({ where: { clase: { id_clase } } });
  }

  // Eliminar (cancelar) asistencia (solo si aún no comienza la clase)
  async remove(id: number, id_usuario: number): Promise<void> {
    const asistencia = await this.asistenciaRepo.findOne({
      where: { id_asistencia: id },
      relations: ['clase', 'cliente'],
    });
    if (!asistencia) throw new NotFoundException('Asistencia no encontrada');

    // Solo el dueño puede cancelar antes de la fecha de clase
    if (asistencia.cliente.usuario.id_usuario !== id_usuario) {
      throw new ForbiddenException('No autorizado');
    }
    if (new Date(asistencia.clase.fecha_clase) <= new Date(new Date().toISOString().split('T')[0])) {
      throw new BadRequestException('No se puede cancelar una clase ya realizada o el mismo día');
    }

    await this.asistenciaRepo.remove(asistencia);
  }
}
