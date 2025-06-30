import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rutina } from '../entities/rutina.entity';
import { Cliente } from '../entities/cliente.entity';
import { ClienteRutina } from '../entities/clienteRutina.entity';
import { CreateRutinaDto } from './dto/createRutina.dto';
import { UpdateRutinaDto } from './dto/updateRutina.dto';
import { Entrenador } from '../entities/entrenador.entity';
import { RutinaEjercicio } from '../entities/rutinaEjercicio.entity';

@Injectable()
export class RutinasService {
  constructor(
    @InjectRepository(Rutina)
    private readonly rutinaRepo: Repository<Rutina>,

    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,

    @InjectRepository(ClienteRutina)
    private readonly crRepo: Repository<ClienteRutina>,

    @InjectRepository(RutinaEjercicio)
    private readonly rutinaEjercRepo: Repository<RutinaEjercicio>,
  ) {}

  // ── CRUD estándar ──────────────────────────────────────────────────────

  async create(dto: CreateRutinaDto): Promise<Rutina> {
    // 1) Extraemos ejercicios del DTO
    const { ejercicios, ...rutinaData } = dto;

    // 2) Preparamos la entidad Rutina
    const entrenador = new Entrenador();
    entrenador.id_entrenador = rutinaData.id_entrenador;

    const rutina = this.rutinaRepo.create({
      nombre: rutinaData.nombre,
      descripcion: rutinaData.descripcion,
      fecha_inicio: new Date(rutinaData.fecha_inicio),
      entrenador,
    });

    // 3) Si hay ejercicios, los mapeamos a entidades RutinaEjercicio
    if (ejercicios && ejercicios.length > 0) {
      rutina['rutinaEjercicios'] = ejercicios.map((e) =>
        this.rutinaEjercRepo.create({
          rutina,
          dia: e.dia,
          orden: e.orden,
          series: e.series,
          peso: e.peso,
          descanso: e.descanso,
          ejercicio: { id_ejercicio: e.id_ejercicio }, // referenciamos sólo la FK
        }),
      );
    }

    // 4) Guardamos TODO de una: Rutina + RutinaEjercicio (cascade)
    return this.rutinaRepo.save(rutina);
  }

  findAll(): Promise<Rutina[]> {
    return this.rutinaRepo.find({
      relations: [
        'entrenador',
        'clientesRutinas',
        'rutinaEjercicios',
        'rutinaEjercicios.ejercicio',
      ],
    });
  }

  async findOne(id: number): Promise<Rutina> {
    const rutina = await this.rutinaRepo.findOne({
      where: { id_rutina: id },
      relations: [
        'entrenador',
        'clientesRutinas',
        'rutinaEjercicios',
        'rutinaEjercicios.ejercicio',
      ],
    });
    if (!rutina) throw new NotFoundException(`Rutina ${id} no encontrada`);
    return rutina;
  }

  async update(id: number, dto: UpdateRutinaDto): Promise<Rutina> {
    const rutina = await this.findOne(id);

    if (dto.nombre !== undefined) rutina.nombre = dto.nombre;
    if (dto.descripcion !== undefined) rutina.descripcion = dto.descripcion;
    if (dto.fecha_inicio) rutina.fecha_inicio = new Date(dto.fecha_inicio);
    if (dto.id_entrenador) {
      const entrenador = new Entrenador();
      entrenador.id_entrenador = dto.id_entrenador;
      rutina.entrenador = entrenador;
    }

    return this.rutinaRepo.save(rutina);
  }

  async remove(id: number): Promise<void> {
    const rutina = await this.findOne(id);
    await this.rutinaRepo.remove(rutina);
  }

  // ── Métodos específicos de cliente ────────────────────────────────────

  /** Devuelve la última rutina “Activa” asignada al cliente */
  async obtenerRutinaCliente(usuarioId: number): Promise<Rutina | null> {
    const cliente = await this.clienteRepo.findOne({
      where: { usuario: { id_usuario: usuarioId } },
      relations: ['usuario'],
    });
    if (!cliente) return null;

    const cr = await this.crRepo.findOne({
      where: {
        cliente: { id_cliente: cliente.id_cliente },
        estado: 'Activa',
      },
      relations: ['rutina', 'rutina.entrenador', 'rutina.clientesRutinas'],
      order: { id: 'DESC' },
    });

    return cr ? cr.rutina : null;
  }

  /** Devuelve todas las rutinas asignadas al cliente */
  async obtenerRutinasCliente(usuarioId: number): Promise<Rutina[]> {
    const cliente = await this.clienteRepo.findOne({
      where: { usuario: { id_usuario: usuarioId } },
      relations: ['usuario'],
    });
    if (!cliente) return [];

    const crs = await this.crRepo.find({
      where: { cliente: { id_cliente: cliente.id_cliente } },
      relations: ['rutina', 'rutina.entrenador', 'rutina.clientesRutinas'],
      order: { id: 'DESC' },
    });

    return crs.map((cr) => cr.rutina);
  }
}
