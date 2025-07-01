import {
  Controller,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { RutinasService } from './rutinas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('rutinas')
export class RutinasController {
  constructor(private readonly rutinasService: RutinasService) {}

  @UseGuards(JwtAuthGuard)
  @Get('mi-rutina')
  async getRutinaClienteLogueado(
    @Req() req: Request & { user?: { id_usuario: number } },
  ) {
    if (!req.user || typeof req.user.id_usuario !== 'number') {
      throw new UnauthorizedException('No autorizado');
    }
    const id_usuario = req.user.id_usuario;
    const rutina = await this.rutinasService.obtenerRutinaCompletaCliente(id_usuario);
    if (!rutina) {
      throw new NotFoundException('No tienes una rutina activa');
    }
    return rutina;
  }

  // ...otros endpoints que tengas...
}
