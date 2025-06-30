import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoGrupoMuscular } from '../entities/tipoGrupoMuscular.entity';

@Injectable()
export class TipoGrupoMuscularService {
  constructor(
    @InjectRepository(TipoGrupoMuscular)
    private repo: Repository<TipoGrupoMuscular>,
  ) {}

  findAll(): Promise<TipoGrupoMuscular[]> {
    return this.repo.find();
  }
}
