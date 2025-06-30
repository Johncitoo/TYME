import { Controller, Get } from '@nestjs/common';
import { TipoEjercicioService } from './tipoEjercicio.service';
import { TipoEjercicio } from '../entities/tipoEjercicio.entity';

@Controller('tipo-ejercicio')
export class TipoEjercicioController {
  constructor(private svc: TipoEjercicioService) {}

  @Get()
  findAll(): Promise<TipoEjercicio[]> {
    return this.svc.findAll();
  }
}
