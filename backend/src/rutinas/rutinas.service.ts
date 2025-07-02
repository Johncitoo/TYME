// src/rutinas/rutinas.service.ts
<<<<<<< HEAD

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rutina } from '../entities/rutina.entity';
import { Cliente } from '../entities/cliente.entity';
import { ClienteRutina } from '../entities/clienteRutina.entity';
import { Entrenador } from '../entities/entrenador.entity';
import { RutinaEjercicio } from '../entities/rutinaEjercicio.entity';

import { CreateRutinaDto } from './dto/createRutina.dto';
import { UpdateRutinaDto } from './dto/updateRutina.dto';
// Removed unused CreateRutinaEjercicioDto import
import { RutinaEjercicioService } from '../rutinaEjercicio/rutinaEjercicio.service';
=======

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository }              from '@nestjs/typeorm';
import { Repository }                    from 'typeorm';

import { Rutina }             from '../entities/rutina.entity';
import { Cliente }            from '../entities/cliente.entity';
import { ClienteRutina }      from '../entities/clienteRutina.entity';
import { Entrenador }         from '../entities/entrenador.entity';
import { RutinaEjercicio }    from '../entities/rutinaEjercicio.entity';

import { CreateRutinaDto }            from './dto/createRutina.dto';
import { UpdateRutinaDto }            from './dto/updateRutina.dto';
import { CreateRutinaEjercicioDto }   from '../rutinaEjercicio/dto/createRutinaEjercicio.dto';
import { RutinaEjercicioService }     from '../rutinaEjercicio/rutinaEjercicioService';
>>>>>>> 59c662f4bcad158c8d9ea18b4c35b116adba064f

@Injectable()
export class RutinasService {
  constructor(
    @InjectRepository(Rutina)
    private readonly rutinaRepo: Repository<Rutina>,

    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,

    @InjectRepository(ClienteRutina)
    private readonly crRepo: Repository<ClienteRutina>,

<<<<<<< HEAD
    @InjectRepository(RutinaEjercicio)
    private readonly rutinaEjercRepo: Repository<RutinaEjercicio>,

=======
>>>>>>> 59c662f4bcad158c8d9ea18b4c35b116adba064f
    private readonly rutinaEjercicioService: RutinaEjercicioService,
  ) {}

  // ── CRUD estándar ──────────────────────────────────────────────────────

  async create(dto: CreateRutinaDto): Promise<Rutina> {
<<<<<<< HEAD
=======
    // (A) Guardar la rutina principal
>>>>>>> 59c662f4bcad158c8d9ea18b4c35b116adba064f
    const rutina = await this.rutinaRepo.save({
      entrenador: { id_entrenador: dto.id_entrenador },
      fecha_inicio: dto.fecha_inicio,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
    });

<<<<<<< HEAD
    for (const ej of dto.ejercicios) {
      await this.rutinaEjercicioService.create({
        ...ej,
        id_rutina: rutina.id_rutina,
      });
=======
    // (B) Asignar cada ejercicio a la rutina recién creada
    for (const ej of dto.ejercicios) {
      const ejercicioDto: CreateRutinaEjercicioDto = {
        ...ej,
        id_rutina: rutina.id_rutina,
      };
      await this.rutinaEjercicioService.create(ejercicioDto);
>>>>>>> 59c662f4bcad158c8d9ea18b4c35b116adba064f
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

<<<<<<< HEAD
    if (dto.nombre !== undefined) rutina.nombre = dto.nombre;
    if (dto.descripcion !== undefined) rutina.descripcion = dto.descripcion;
    if (dto.fecha_inicio) rutina.fecha_inicio = new Date(dto.fecha_inicio);
    if (dto.id_entrenador) {
      rutina.entrenador = { id_entrenador: dto.id_entrenador } as Entrenador;
    }

    if (dto.ejercicios) {
      // Eliminar los ejercicios que ya no vienen
      const actuales = await this.rutinaEjercRepo.find({
        where: { rutina: { id_rutina: id } },
      });
      const enviados = dto.ejercicios
        .filter((e) => e.id_rutina_ejercicio != null)
        .map((e) => e.id_rutina_ejercicio as number);

      for (const act of actuales) {
        if (!enviados.includes(act.id_rutina_ejercicio)) {
          await this.rutinaEjercRepo.remove(act);
        }
      }

      // Crear o actualizar los ejercicios enviados
      for (const ej of dto.ejercicios) {
        if (ej.id_rutina_ejercicio) {
          await this.rutinaEjercRepo.update(ej.id_rutina_ejercicio, {
=======
    // Actualizar datos básicos
    if (dto.nombre !== undefined)    rutina.nombre        = dto.nombre;
    if (dto.descripcion !== undefined) rutina.descripcion = dto.descripcion;
    if (dto.fecha_inicio)             rutina.fecha_inicio = new Date(dto.fecha_inicio);
    if (dto.id_entrenador) {
      const ent = new Entrenador();
      ent.id_entrenador = dto.id_entrenador;
      rutina.entrenador = ent;
    }

    // Sincronizar ejercicios si vienen en el DTO
    if (dto.ejercicios) {
      // 1) Obtener ejercicios actuales
      const actuales = await this.rutinaRepo
        .createQueryBuilder()
        .relation(Rutina, 'rutinaEjercicios')
        .of(id)
        .loadMany<RutinaEjercicio>();

      const idsEnviado = dto.ejercicios
        .filter(e => e.id_rutina_ejercicio != null)
        .map(e => e.id_rutina_ejercicio as number);

      // 2) Eliminar los que ya no estén
      for (const act of actuales) {
        if (!idsEnviado.includes(act.id_rutina_ejercicio)) {
          await this.rutinaEjercicioService.remove(act.id_rutina_ejercicio);
        }
      }

      // 3) Crear/Actualizar los enviados
      for (const ej of dto.ejercicios) {
        if (ej.id_rutina_ejercicio) {
          // Actualizar existente
          await this.rutinaEjercicioService.update(ej.id_rutina_ejercicio, {
>>>>>>> 59c662f4bcad158c8d9ea18b4c35b116adba064f
            dia: ej.dia,
            orden: ej.orden,
            series: ej.series,
            peso: ej.peso,
            descanso: ej.descanso,
            observacion: ej.observacion,
<<<<<<< HEAD
            ejercicio: { id_ejercicio: ej.id_ejercicio },
          });
        } else {
          await this.rutinaEjercRepo.save({
            rutina: { id_rutina: id } as Rutina,
            ejercicio: { id_ejercicio: ej.id_ejercicio } as {
              id_ejercicio: number;
            },
            dia: ej.dia,
            orden: ej.orden,
            series: ej.series,
            peso: ej.peso,
            descanso: ej.descanso,
            observacion: ej.observacion,
=======
            id_ejercicio: ej.id_ejercicio,
          });
        } else {
          // Nuevo ejercicio
          await this.rutinaEjercicioService.create({
            ...ej,
            id_rutina: id,
>>>>>>> 59c662f4bcad158c8d9ea18b4c35b116adba064f
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

<<<<<<< HEAD
  /** Rutina activa de un cliente */
=======
  /** Devuelve la rutina activa (con todos sus ejercicios y entrenador) de un cliente */
>>>>>>> 59c662f4bcad158c8d9ea18b4c35b116adba064f
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
<<<<<<< HEAD
      .where('cr.cliente = :c', { c: cliente.id_cliente })
      .andWhere('cr.estado = :e', { e: 'Activa' })
      .orderBy('rutinaEjercicios.dia', 'ASC')
      .addOrderBy('rutinaEjercicios.orden', 'ASC')
      .getOne();

    return cr?.rutina ?? null;
  }
  async obtenerRutinaCompletaCliente(
    usuarioId: number,
  ): Promise<Rutina | null> {
    return this.obtenerRutinaCliente(usuarioId);
  }

  /** Historial completo de rutinas de un cliente */
=======
      .where('cr.cliente = :id', { id: cliente.id_cliente })
      .andWhere('cr.estado  = :est', { est: 'Activa' })
      .orderBy('rutinaEjercicios.dia',   'ASC')
      .addOrderBy('rutinaEjercicios.orden','ASC')
      .getOne();

    return cr?.rutina ?? null;
  }

  /** Igual que obtenerRutinaCliente, pero con un nombre distinto */
  async obtenerRutinaCompletaCliente(id_usuario: number): Promise<Rutina | null> {
    return this.obtenerRutinaCliente(id_usuario);
  }

  /** Devuelve todas las rutinas (activa o no) de un cliente, ordenadas por fecha */
>>>>>>> 59c662f4bcad158c8d9ea18b4c35b116adba064f
  async obtenerRutinasCliente(usuarioId: number): Promise<Rutina[]> {
    const cliente = await this.clienteRepo.findOne({
      where: { usuario: { id_usuario: usuarioId } },
      relations: ['usuario'],
    });
    if (!cliente) return [];

    const crs = await this.crRepo.find({
      where: { cliente: { id_cliente: cliente.id_cliente } },
<<<<<<< HEAD
      order: { id: 'DESC' },
      relations: ['rutina'],
    });

    return crs.map((cr) => cr.rutina);
=======
      relations: ['rutina', 'rutina.entrenador', 'rutina.clientesRutinas'],
      order: { id: 'DESC' },
    });

    return crs.map(cr => cr.rutina);
>>>>>>> 59c662f4bcad158c8d9ea18b4c35b116adba064f
  }
}

