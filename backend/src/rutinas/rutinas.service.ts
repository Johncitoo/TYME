// src/rutinas/rutinas.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository }              from '@nestjs/typeorm';
import { Repository }                    from 'typeorm';

import { Rutina }           from '../entities/rutina.entity';
import { Cliente }          from '../entities/cliente.entity';
import { ClienteRutina }    from '../entities/clienteRutina.entity';
import { Entrenador }       from '../entities/entrenador.entity';
import { RutinaEjercicio }  from '../entities/rutinaEjercicio.entity';

import { CreateRutinaDto }          from './dto/createRutina.dto';
import { UpdateRutinaDto }          from './dto/updateRutina.dto';
import { CreateRutinaEjercicioDto } from '../rutinaEjercicio/dto/createRutinaEjercicio.dto';
import { RutinaEjercicioService }   from '../rutinaEjercicio/rutinaEjercicioService';

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

    private readonly rutinaEjercicioService: RutinaEjercicioService,
  ) {}

  // ── CRUD estándar ──────────────────────────────────────────────────────

  async create(dto: CreateRutinaDto): Promise<Rutina> {
    const rutina = await this.rutinaRepo.save({
      entrenador: { id_entrenador: dto.id_entrenador },
      fecha_inicio: dto.fecha_inicio,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
    });

    for (const ej of dto.ejercicios) {
      await this.rutinaEjercicioService.create({
        ...ej,
        id_rutina: rutina.id_rutina,
      });
    }

    return rutina;
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

    if (dto.nombre !== undefined)       rutina.nombre        = dto.nombre;
    if (dto.descripcion !== undefined)  rutina.descripcion   = dto.descripcion;
    if (dto.fecha_inicio)               rutina.fecha_inicio = new Date(dto.fecha_inicio);
    if (dto.id_entrenador) {
      rutina.entrenador = { id_entrenador: dto.id_entrenador } as Entrenador;
    }

    if (dto.ejercicios) {
      // Eliminar los ejercicios que ya no vienen
      const actuales = await this.rutinaEjercRepo.find({ where: { rutina: { id_rutina: id } } });
      const enviados = dto.ejercicios
        .filter(e => e.id_rutina_ejercicio != null)
        .map(e => e.id_rutina_ejercicio!) as number[];

      for (const act of actuales) {
        if (!enviados.includes(act.id_rutina_ejercicio)) {
          await this.rutinaEjercRepo.remove(act);
        }
      }

      // Crear o actualizar los ejercicios enviados
      for (const ej of dto.ejercicios) {
        if (ej.id_rutina_ejercicio) {
          await this.rutinaEjercRepo.update(ej.id_rutina_ejercicio, {
            dia: ej.dia,
            orden: ej.orden,
            series: ej.series,
            peso: ej.peso,
            descanso: ej.descanso,
            observacion: ej.observacion,
            ejercicio: { id_ejercicio: ej.id_ejercicio },
          });
        } else {
          await this.rutinaEjercRepo.save({
            rutina: { id_rutina: id } as any,
            ejercicio: { id_ejercicio: ej.id_ejercicio } as any,
            dia: ej.dia,
            orden: ej.orden,
            series: ej.series,
            peso: ej.peso,
            descanso: ej.descanso,
            observacion: ej.observacion,
          });
        }
      }
    }

    return this.rutinaRepo.save(rutina);
  }

  async remove(id: number): Promise<void> {
    const rutina = await this.findOne(id);
    await this.rutinaRepo.remove(rutina);
  }

  // ── Métodos específicos de cliente ────────────────────────────────────

  /** Rutina activa de un cliente */
  async obtenerRutinaCliente(usuarioId: number): Promise<Rutina | null> {
    const cliente = await this.clienteRepo.findOne({
      where: { usuario: { id_usuario: usuarioId } },
      relations: ['usuario'],
    });
    if (!cliente) return null;

    const cr = await this.crRepo
      .createQueryBuilder('cr')
      .leftJoinAndSelect('cr.rutina', 'rutina')
      .leftJoinAndSelect('rutina.entrenador', 'entrenador')
      .leftJoinAndSelect('rutina.rutinaEjercicios', 'rutinaEjercicios')
      .leftJoinAndSelect('rutinaEjercicios.ejercicio', 'ejercicio')
      .where('cr.cliente = :c', { c: cliente.id_cliente })
      .andWhere('cr.estado = :e', { e: 'Activa' })
      .orderBy('rutinaEjercicios.dia', 'ASC')
      .addOrderBy('rutinaEjercicios.orden', 'ASC')
      .getOne();

    return cr?.rutina ?? null;
  }

  /** Alias para compatibilidad con el controller */
  async obtenerRutinaCompletaCliente(usuarioId: number): Promise<Rutina | null> {
    return this.obtenerRutinaCliente(usuarioId);
  }

  /** Historial completo de rutinas de un cliente */
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

    return crs.map(cr => cr.rutina);
  }
}

