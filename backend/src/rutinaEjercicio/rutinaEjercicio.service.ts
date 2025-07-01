// src/rutinas/rutina-ejercicio.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RutinaEjercicio } from './rutinaEjercicio.entity';
import { CreateRutinaEjercicioDto } from './dto/createRutinaEjercicio.dto';
import { UpdateRutinaEjercicioDto } from './dto/updateRutinaEjercicio.dto';  // <-- Importa este DTO

@Injectable()
export class RutinaEjercicioService {
  constructor(
    @InjectRepository(RutinaEjercicio)
    private readonly repo: Repository<RutinaEjercicio>,
  ) {}

  async create(dto: CreateRutinaEjercicioDto) {
    const entity = this.repo.create({
      dia: dto.dia,
      orden: dto.orden,
      series: dto.series,
      peso: dto.peso,
      descanso: dto.descanso,
      observacion: dto.observacion,
      rutina: { id_rutina: dto.id_rutina },
      ejercicio: { id_ejercicio: dto.id_ejercicio },
    });
    return this.repo.save(entity);
  }

  async findByRutina(id_rutina: number) {
    return this.repo.find({
      where: { rutina: { id_rutina } },
      order: { dia: 'ASC', orden: 'ASC' },
      relations: ['ejercicio'], // agrego relación ejercicio para traer detalles
    });
  }

  async update(id: number, dto: UpdateRutinaEjercicioDto) {
    return this.repo.update(id, dto);
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }

  async findRutinaCompletaByCliente(id_cliente: number) {
    const ejercicios = await this.repo
      .createQueryBuilder('re')
      .innerJoinAndSelect('re.rutina', 'rutina')
      .innerJoin('rutina.clientes', 'cliente')  // Ajusta el nombre de la relación según tu entidad
      .innerJoinAndSelect('re.ejercicio', 'ejercicio')
      .where('cliente.id_cliente = :id_cliente', { id_cliente })
      .andWhere('rutina.estado = :estado', { estado: 'Activa' })
      .orderBy('re.dia', 'ASC')
      .addOrderBy('re.orden', 'ASC')
      .getMany();

    return ejercicios;
  }
}
