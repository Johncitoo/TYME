// src/rutinas/rutina-ejercicio.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RutinaEjercicio } from './rutinaEjercicio.entity';
import { CreateRutinaEjercicioDto } from './dto/createRutinaEjercicio.dto';
import { UpdateRutinaEjercicioDto } from './dto/updateRutinaEjercicio.dto';

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
      // aquí vinculamos explícitamente la rutina y el ejercicio
      rutina: { id_rutina: dto.id_rutina },
      ejercicio: { id_ejercicio: dto.id_ejercicio },
    });
    return this.repo.save(entity);
  }

  async findByRutina(id_rutina: number) {
    return this.repo.find({
      where: { rutina: { id_rutina } },
      order: { dia: 'ASC', orden: 'ASC' },
    });
  }

  async update(id: number, dto: UpdateRutinaEjercicioDto) {
    return this.repo.update(id, dto);
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }
}
