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
import { RutinaEjercicioService } from '../rutinaEjercicio/rutinaEjercicioService';
import { CreateRutinaEjercicioDto } from '../rutinaEjercicio/dto/createRutinaEjercicio.dto';

@Injectable()
export class RutinasService {
  constructor(
    @InjectRepository(Rutina)
    private readonly rutinaRepo: Repository<Rutina>,
    @InjectRepository(RutinaEjercicio)
    private readonly rutinaEjercRepo: Repository<RutinaEjercicio>,
    private readonly rutinaEjercicioService: RutinaEjercicioService,

    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,

    @InjectRepository(ClienteRutina)
    private readonly crRepo: Repository<ClienteRutina>,
  ) {}

  // ── CRUD estándar ──────────────────────────────

  async create(dto: CreateRutinaDto): Promise<Rutina> {
    // (A) Guardar la rutina y obtener su ID
    const rutina = await this.rutinaRepo.save({
      entrenador: { id_entrenador: dto.id_entrenador },
      fecha_inicio: dto.fecha_inicio,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
    });

    // (B) Recorrer ejercicios y asignarles el FK antes de crear
    for (const ej of dto.ejercicios) {
      const ejercicioDto: CreateRutinaEjercicioDto = {
        ...ej,
        id_rutina: rutina.id_rutina, // ← aquí el FK que faltaba
      };
      await this.rutinaEjercicioService.create(ejercicioDto);
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

    // Actualiza datos básicos
    if (dto.nombre !== undefined) rutina.nombre = dto.nombre;
    if (dto.descripcion !== undefined) rutina.descripcion = dto.descripcion;
    if (dto.fecha_inicio) rutina.fecha_inicio = new Date(dto.fecha_inicio);
    if (dto.id_entrenador) {
      const entrenador = new Entrenador();
      entrenador.id_entrenador = dto.id_entrenador;
      rutina.entrenador = entrenador;
    }

    // Si hay ejercicios en el dto, sincronizarlos
    if (dto.ejercicios) {
      // 1. Trae todos los ejercicios actuales de la rutina
      const actuales = await this.rutinaEjercRepo.find({
        where: { rutina: { id_rutina: id } },
      });

      // 2. Identifica ids existentes y nuevos
      const idsEnviado = dto.ejercicios
        .filter((e) => e.id_rutina_ejercicio !== undefined)
        .map((e) => e.id_rutina_ejercicio as number);

      // 3. Quitar ejercicios que no estén en la nueva lista
      for (const ejActual of actuales) {
        if (!idsEnviado.includes(ejActual.id_rutina_ejercicio)) {
          await this.rutinaEjercRepo.remove(ejActual);
        }
      }

      // 4. Agrega/actualiza los ejercicios enviados
      for (const ej of dto.ejercicios) {
        if (ej.id_rutina_ejercicio) {
          // Update ejercicio existente (NO toques id_rutina aquí)
          await this.rutinaEjercRepo.update(
            { id_rutina_ejercicio: ej.id_rutina_ejercicio },
            {
              dia: Number(ej.dia),
              orden: ej.orden,
              series: ej.series,
              peso: ej.peso,
              descanso: ej.descanso,
              observacion: ej.observacion,
              ejercicio: { id_ejercicio: ej.id_ejercicio },
            },
          );
        } else {
          // Nuevo ejercicio: SIEMPRE asigna la rutina
          await this.rutinaEjercRepo.save(
            this.rutinaEjercRepo.create({
              rutina: { id_rutina: id },
              ejercicio: { id_ejercicio: ej.id_ejercicio },
              dia: Number(ej.dia),
              orden: ej.orden,
              series: ej.series,
              peso: ej.peso,
              descanso: ej.descanso,
              observacion: ej.observacion,
            }),
          );
        }
      }
    }

    return this.rutinaRepo.save(rutina);
  }

  async remove(id: number): Promise<void> {
    const rutina = await this.findOne(id);
    await this.rutinaRepo.remove(rutina);
  }

  // ── Métodos específicos de cliente ─────────────────────

  async obtenerRutinaCliente(usuarioId: number): Promise<Rutina | null> {
    const cliente = await this.clienteRepo.findOne({
      where: { usuario: { id_usuario: usuarioId } },
      relations: ['usuario'],
    });
    if (!cliente) return null;

    const clienteRutina = await this.crRepo
      .createQueryBuilder('cr')
      .leftJoinAndSelect('cr.rutina', 'rutina')
      .leftJoinAndSelect('rutina.entrenador', 'entrenador')
      .leftJoinAndSelect('rutina.rutinaEjercicios', 'rutinaEjercicios')
      .leftJoinAndSelect('rutinaEjercicios.ejercicio', 'ejercicio')
      .where('cr.cliente = :clienteId', { clienteId: cliente.id_cliente })
      .andWhere('cr.estado = :estado', { estado: 'Activa' })
      .orderBy('rutinaEjercicios.dia', 'ASC')
      .addOrderBy('rutinaEjercicios.orden', 'ASC')
      .getOne();

    return clienteRutina ? clienteRutina.rutina : null;
  }

  async obtenerRutinaCompletaCliente(id_usuario: number): Promise<Rutina | null> {
    // Puede ser igual a obtenerRutinaCliente, según la lógica de tu frontend
    return this.obtenerRutinaCliente(id_usuario);
  }

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
