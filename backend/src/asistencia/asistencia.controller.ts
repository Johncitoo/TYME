// src/asistencia/asistencia.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AsistenciaService } from './asistencia.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';

@Controller('asistencia')
@UseGuards(JwtAuthGuard)
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  // Inscribir asistencia (el usuario debe ser cliente)
  @Post()
  async inscribir(@Body() dto: CreateAsistenciaDto, @Req() req) {
    const id_usuario = req.user.id_usuario; // <-- Cambiado aquí
    return this.asistenciaService.create(dto, id_usuario);
  }

  // Ver asistencias del cliente logeado
  @Get('mis-asistencias')
  async misAsistencias(@Req() req) {
    const id_usuario = req.user.id_usuario; // <-- Cambiado aquí
    return this.asistenciaService.findByCliente(id_usuario);
  }

  // Ver asistentes de una clase (opcional para admin/entrenador)
  @Get('clase/:id')
  async asistentesClase(@Param('id', ParseIntPipe) id: number) {
    return this.asistenciaService.findByClase(id);
  }

  // Cancelar asistencia del usuario logeado
  @Delete(':id')
  async cancelar(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const id_usuario = req.user.id_usuario; // <-- Cambiado aquí
    await this.asistenciaService.remove(id, id_usuario);
    return { message: 'Asistencia cancelada' };
  }
}
