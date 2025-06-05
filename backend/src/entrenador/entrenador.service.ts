import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrenador } from '../entities/entrenador.entity';

@Injectable()
export class EntrenadorService {
  constructor(
    @InjectRepository(Entrenador)
    private readonly entrenadorRepo: Repository<Entrenador>,
  ) {}

  /**
   * Devuelve todos los entrenadores, cargando también la propiedad "usuario"
   * para que podamos, por ejemplo, mostrar nombre y apellido del usuario-entrenador.
   */
  findAll(): Promise<Entrenador[]> {
    return this.entrenadorRepo.find({
      relations: ['usuario'],
    });
  }
}
