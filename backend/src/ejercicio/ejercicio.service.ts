import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ejercicio } from '../entities/ejercicio.entity';
import { CreateEjercicioDto } from './dto/createEjercicio.dto';
import { UpdateEjercicioDto } from './dto/updateEjercicio.dto';

export interface EjercicioDto {
  id_ejercicio: number;
  nombre: string;
  descripcion?: string;
  video_url?: string;
  imagen_url?: string;
  id_tipo_ejercicio: number;
  tipoEjercicio: { id_tipo_ejercicio: number; nombre: string };
  id_grupo_muscular: number;
  grupoMuscular: { id_grupo_muscular: number; nombre: string };
}

@Injectable()
export class EjercicioService {
  constructor(
    @InjectRepository(Ejercicio)
    private readonly repo: Repository<Ejercicio>,
  ) {}

  private toDto(e: Ejercicio): EjercicioDto {
    return {
      id_ejercicio: e.id_ejercicio,
      nombre: e.nombre,
      descripcion: e.descripcion,
      video_url: e.video_url,
      imagen_url: e.imagen_url,
      id_tipo_ejercicio: e.tipoEjercicio.id_tipo_ejercicio,
      tipoEjercicio: {
        id_tipo_ejercicio: e.tipoEjercicio.id_tipo_ejercicio,
        nombre: e.tipoEjercicio.nombre,
      },
      id_grupo_muscular: e.grupoMuscular.id_grupo_muscular,
      grupoMuscular: {
        id_grupo_muscular: e.grupoMuscular.id_grupo_muscular,
        nombre: e.grupoMuscular.nombre,
      },
    };
  }

  async create(dto: CreateEjercicioDto): Promise<EjercicioDto> {
    const ejercicio = this.repo.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      video_url: dto.video_url,
      imagen_url: dto.imagen_url,
      grupoMuscular: { id_grupo_muscular: dto.id_grupo_muscular },
      tipoEjercicio: { id_tipo_ejercicio: dto.id_tipo_ejercicio },
    });
    const saved = await this.repo.save(ejercicio);
    return this.toDto(saved);
  }

  async findAll(): Promise<EjercicioDto[]> {
    const all = await this.repo.find();
    return all.map((e) => this.toDto(e));
  }

  async findOne(id: number): Promise<EjercicioDto> {
    const e = await this.repo.findOne({ where: { id_ejercicio: id } });
    if (!e) throw new NotFoundException(`Ejercicio #${id} no encontrado`);
    return this.toDto(e);
  }

  async update(id: number, dto: UpdateEjercicioDto): Promise<EjercicioDto> {
    const ejerc = await this.repo.findOneOrFail({
      where: { id_ejercicio: id },
    });
    Object.assign(ejerc, {
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      video_url: dto.video_url,
      imagen_url: dto.imagen_url,
      grupoMuscular: dto.id_grupo_muscular
        ? { id_grupo_muscular: dto.id_grupo_muscular }
        : ejerc.grupoMuscular,
      tipoEjercicio: dto.id_tipo_ejercicio
        ? { id_tipo_ejercicio: dto.id_tipo_ejercicio }
        : ejerc.tipoEjercicio,
    });
    const updated = await this.repo.save(ejerc);
    return this.toDto(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Ejercicio #${id} no encontrado`);
  }
}
