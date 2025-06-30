// src/clase/clase.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clase } from './clase.entity';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import { Entrenador } from '../entities/entrenador.entity';
import { Usuario } from '../entities/user.entity';

@Injectable()
export class ClaseService {
  constructor(
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
    @InjectRepository(Entrenador)
    private readonly entrenadorRepository: Repository<Entrenador>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createClaseDto: CreateClaseDto, id_usuario: number): Promise<Clase> {
    // Busca el usuario
    const usuario = await this.usuarioRepository.findOne({ where: { id_usuario } });
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');

    // Busca el entrenador asociado (si existe)
    const entrenador = await this.entrenadorRepository.findOne({
      where: { usuario: { id_usuario } },
    });

    // Si es admin (id_tipo_usuario === 1) o existe como entrenador, lo permite
    if (!entrenador && usuario.id_tipo_usuario !== 1) {
      throw new UnauthorizedException('No eres entrenador o admin');
    }

    const clase = this.claseRepository.create({
      ...createClaseDto,
      ...(entrenador && { entrenador }), // Solo agrega entrenador si existe
    });
    return await this.claseRepository.save(clase);
  }

  findAll(): Promise<Clase[]> {
    return this.claseRepository.find();
  }

  async findOne(id: number): Promise<Clase> {
    const clase = await this.claseRepository.findOne({ where: { id_clase: id } });
    if (!clase) throw new NotFoundException('Clase no encontrada');
    return clase;
  }

  async update(id: number, updateClaseDto: UpdateClaseDto): Promise<Clase> {
    await this.claseRepository.update(id, updateClaseDto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const clase = await this.findOne(id);
    await this.claseRepository.remove(clase);
  }
}
