import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoEjercicio } from '../entities/tipoEjercicio.entity';

@Injectable()
export class TipoEjercicioService {
  constructor(
    @InjectRepository(TipoEjercicio)
    private repo: Repository<TipoEjercicio>,
  ) {}

  findAll(): Promise<TipoEjercicio[]> {
    return this.repo.find();
  }
}
