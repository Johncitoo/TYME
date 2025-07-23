// src/rutinas/rutinas.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Rutina } from '../entities/rutina.entity';
import { Cliente } from '../entities/cliente.entity';
import { ClienteRutina } from '../entities/clienteRutina.entity';
import { Entrenador } from '../entities/entrenador.entity';
import { RutinaEjercicio } from '../entities/rutinaEjercicio.entity';
import { Ejercicio } from '../entities/ejercicio.entity';

import { CreateRutinaDto } from './dto/createRutina.dto';
import { UpdateRutinaDto } from './dto/updateRutina.dto';
import { RutinaEjercicioService } from '../rutinaEjercicio/rutinaEjercicio.service';

@Injectable()
export class RutinasService {
  constructor(
    private readonly dataSource: DataSource,

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

  async create(dto: CreateRutinaDto): Promise<Rutina> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      await qr.manager.update(
        ClienteRutina,
        { idCliente: dto.id_cliente, estado: 'Activa' },
        { estado: 'Inactiva' },
      );

      const rutina = qr.manager.create(Rutina, {
        entrenador: { id_entrenador: dto.id_entrenador } as Entrenador,
        fecha_inicio: dto.fecha_inicio,
        nombre: dto.nombre,
        descripcion: dto.descripcion,
      });
      const savedRutina = await qr.manager.save(rutina);

      await qr.manager
        .createQueryBuilder()
        .insert()
        .into(ClienteRutina)
        .values({
          estado: 'Activa',
          idRutina: savedRutina.id_rutina,
          idCliente: dto.id_cliente,
        })
        .execute();

      for (const ex of dto.ejercicios) {
        const re = qr.manager.create(RutinaEjercicio, {
          rutina: { id_rutina: savedRutina.id_rutina } as Rutina,
          ejercicio: { id_ejercicio: ex.id_ejercicio } as Ejercicio,
          dia: ex.dia,
          orden: ex.orden,
          series: ex.series,
          peso: ex.peso,
          descanso: ex.descanso,
          observacion: ex.observacion,
        });
        await qr.manager.save(re);
      }

      await qr.commitTransaction();
      return savedRutina;
    } catch (error: any) {
      await qr.rollbackTransaction();
      throw new InternalServerErrorException(
        'Error al crear rutina: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      await qr.release();
    }
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
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      if (dto.id_cliente) {
        await qr.manager.update(
          ClienteRutina,
          { idCliente: dto.id_cliente, estado: 'Activa' },
          { estado: 'Inactiva' },
        );

        const existente = await qr.manager.findOne(ClienteRutina, {
          where: {
            idCliente: dto.id_cliente,
            idRutina: id,
          },
        });

        if (!existente) {
          await qr.manager
            .createQueryBuilder()
            .insert()
            .into(ClienteRutina)
            .values({
              estado: 'Activa',
              idRutina: id,
              idCliente: dto.id_cliente,
            })
            .execute();
        } else {
          await qr.manager.update(
            ClienteRutina,
            { idCliente: dto.id_cliente, idRutina: id },
            { estado: 'Activa' },
          );
        }
      }

      const rutina = await this.findOne(id);
      if (dto.nombre !== undefined) rutina.nombre = dto.nombre;
      if (dto.descripcion !== undefined) rutina.descripcion = dto.descripcion;
      if (dto.fecha_inicio) rutina.fecha_inicio = new Date(dto.fecha_inicio);
      if (dto.id_entrenador) {
        rutina.entrenador = { id_entrenador: dto.id_entrenador } as Entrenador;
      }
      await qr.manager.save(rutina);

      if (dto.ejercicios) {
        const actuales = await qr.manager.find(RutinaEjercicio, {
          where: { rutina: { id_rutina: id } },
        });
        const enviados = dto.ejercicios
          .filter((e) => e.id_rutina_ejercicio != null)
          .map((e) => e.id_rutina_ejercicio as number);

        for (const act of actuales) {
          if (!enviados.includes(act.id_rutina_ejercicio)) {
            await qr.manager.remove(RutinaEjercicio, act);
          }
        }

        for (const ex of dto.ejercicios) {
          if (ex.id_rutina_ejercicio) {
            await qr.manager.update(RutinaEjercicio, ex.id_rutina_ejercicio, {
              dia: ex.dia,
              orden: ex.orden,
              series: ex.series,
              peso: ex.peso,
              descanso: ex.descanso,
              observacion: ex.observacion,
              ejercicio: { id_ejercicio: ex.id_ejercicio },
            });
          } else {
            await qr.manager.save(
              qr.manager.create(RutinaEjercicio, {
                rutina: { id_rutina: id } as Rutina,
                ejercicio: { id_ejercicio: ex.id_ejercicio },
                dia: ex.dia,
                orden: ex.orden,
                series: ex.series,
                peso: ex.peso,
                descanso: ex.descanso,
                observacion: ex.observacion,
              }),
            );
          }
        }
      }

      await qr.commitTransaction();
      return this.findOne(id);
    } catch (err: any) {
      await qr.rollbackTransaction();
      throw new InternalServerErrorException(
        'Error al actualizar rutina: ' +
          (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      await qr.release();
    }
  }

  async remove(id: number): Promise<void> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      await qr.manager
        .createQueryBuilder()
        .delete()
        .from(ClienteRutina)
        .where('rutina = :rid', { rid: id })
        .execute();

      await qr.manager
        .createQueryBuilder()
        .delete()
        .from(RutinaEjercicio)
        .where('rutina = :rid', { rid: id })
        .execute();

      await qr.manager
        .createQueryBuilder()
        .delete()
        .from(Rutina)
        .where('id_rutina = :rid', { rid: id })
        .execute();

      await qr.commitTransaction();
    } catch (err: any) {
      await qr.rollbackTransaction();
      throw new InternalServerErrorException(
        'Error al eliminar rutina: ' +
          (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      await qr.release();
    }
  }

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

  async obtenerRutinasCliente(usuarioId: number): Promise<Rutina[]> {
    const cliente = await this.clienteRepo.findOne({
      where: { usuario: { id_usuario: usuarioId } },
      relations: ['usuario'],
    });
    if (!cliente) return [];

    const crs = await this.crRepo.find({
      where: { cliente: { id_cliente: cliente.id_cliente } },
      order: { id: 'DESC' },
      relations: [
        'rutina',
        'rutina.entrenador',
        'rutina.rutinaEjercicios',
        'rutina.rutinaEjercicios.ejercicio',
        'rutina.clientesRutinas',
      ],
    });

    return crs.map((cr) => cr.rutina);
  }
}
