import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { RutinasService } from './rutinas.service';
// Si usas autenticación con JWT, importa el guardia correspondiente
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// Si quieres obtener el usuario del request, puedes importar Request de express
import { Request } from 'express';

@Controller('rutinas')
export class RutinasController {
  constructor(private readonly rutinasService: RutinasService) {}

  // Ejemplo: /rutinas/cliente/:usuarioId
  @UseGuards(JwtAuthGuard)
  @Get('cliente/:usuarioId')
  async getRutinaDeCliente(@Param('usuarioId') usuarioId: number) {
    return this.rutinasService.obtenerRutinaCliente(usuarioId);
  }

  // Opcional: obtener todas las rutinas de un cliente
  @UseGuards(JwtAuthGuard)
  @Get('cliente/:usuarioId/todas')
  async getRutinasDeCliente(@Param('usuarioId') usuarioId: number) {
    return this.rutinasService.obtenerRutinasCliente(usuarioId);
  }

  // Ejemplo: si quieres obtener la rutina por el usuario autenticado sin pasar el ID en la ruta
  // (Requiere que en el request esté el usuario, ej: con Passport y JWT)
  @UseGuards(JwtAuthGuard)
  @Get('mi-rutina')
  async getRutinaAutenticada(@Req() req: Request) {
    // El JWT debe poner el usuario en req.user
    // Cambia esto según cómo guardas el id_usuario en el JWT
    // @ts-ignore
    const usuarioId = req.user?.id_usuario;
    return this.rutinasService.obtenerRutinaCliente(usuarioId);
  }
}
