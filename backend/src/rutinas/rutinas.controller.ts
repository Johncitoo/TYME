// backend/src/rutinas/rutinas.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RutinasService } from './rutinas.service';
import { CreateRutinaDto } from './dto/createRutina.dto';
import { UpdateRutinaDto } from './dto/updateRutina.dto';
//import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { Rutina } from '/entities/rutina.entity'; // Adjust the path if needed

//@UseGuards(JwtAuthGuard) // Aplica JWT a todos los endpoints; si quieres algunos públicos, muévelos abajo
@Controller('rutinas')
export class RutinasController {
  constructor(private readonly rutinasService: RutinasService) {}

  // ── CRUD estándar ──────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRutinaDto): Promise<any> {
    return await this.rutinasService.create(dto);
  }

  @Get()
  async findAll(): Promise<any> {
    return await this.rutinasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.rutinasService.findOne(id);
  }

  // GET /rutinas/:id/ejercicios
  @Get(':id/ejercicios')
  async getWithExercises(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Rutina> {
    // reutilizamos findOne, que ya trae relations: ['rutinaEjercicios', 'rutinaEjercicios.ejercicio']
    return this.rutinasService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRutinaDto,
  ): Promise<any> {
    return await this.rutinasService.update(id, dto);
  }

  @Put(':id')
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRutinaDto,
  ): Promise<any> {
    return await this.rutinasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.rutinasService.remove(id);
  }

  // ── Endpoints específicos de cliente ─────────────────────────────────

  // /rutinas/cliente/:usuarioId
  @Get('cliente/:usuarioId')
  async getRutinaDeCliente(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<any> {
    return await this.rutinasService.obtenerRutinaCliente(usuarioId);
  }

  // /rutinas/cliente/:usuarioId/todas
  @Get('cliente/:usuarioId/todas')
  async getRutinasDeCliente(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<any> {
    return await this.rutinasService.obtenerRutinasCliente(usuarioId);
  }

  // /rutinas/mi-rutina — para el usuario autenticado
  @Get('mi-rutina')
  async getRutinaAutenticada(
    @Req() req: Request & { user?: { id_usuario: number } },
  ): Promise<any> {
    if (!req.user || typeof req.user.id_usuario !== 'number') {
      throw new Error('Usuario no autenticado o id_usuario no válido');
    }
    const usuarioId: number = req.user.id_usuario;
    return await this.rutinasService.obtenerRutinaCliente(usuarioId);
  }
}
