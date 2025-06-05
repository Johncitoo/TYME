import { Controller, Get } from '@nestjs/common';
import { EntrenadorService } from './entrenador.service';
import { Entrenador } from '../entities/entrenador.entity';

@Controller('entrenador')
export class EntrenadorController {
  constructor(private readonly entrenadorService: EntrenadorService) {}

  /**
   * GET /entrenador
   * Devuelve la lista completa de entrenadores con su usuario relacionado.
   */
  @Get()
  async getAll(): Promise<Entrenador[]> {
    return this.entrenadorService.findAll();
  }
}
