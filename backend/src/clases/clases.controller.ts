import { Controller, Get, Query } from '@nestjs/common';
import { ClasesService } from './clases.service';

@Controller('api/clases')
export class ClasesController {
  constructor(private readonly clasesService: ClasesService) {}

  // GET /api/clases/proxima?usuarioId=2
  @Get('proxima')
  async getProximaClase(@Query('usuarioId') usuarioId: number) {
    return await this.clasesService.obtenerProximaClase(usuarioId);
  }

  // GET /api/clases/fechas?usuarioId=2
  @Get('fechas')
  async getFechasClases(@Query('usuarioId') usuarioId: number) {
    return await this.clasesService.obtenerFechasClases(usuarioId);
  }
}
