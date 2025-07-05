import { Controller, Get } from '@nestjs/common';
import { TipoGrupoMuscularService } from './tipoGrupoMuscular.service';
import { TipoGrupoMuscular } from '../entities/tipoGrupoMuscular.entity';

@Controller('tipo-grupo-muscular')
export class TipoGrupoMuscularController {
  constructor(private svc: TipoGrupoMuscularService) {}

  @Get()
  findAll(): Promise<TipoGrupoMuscular[]> {
    return this.svc.findAll();
  }
}
