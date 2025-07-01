// src/rutinas/rutinas.controller.ts

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
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

import { RutinasService } from './rutinas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRutinaDto } from './dto/createRutina.dto';
import { UpdateRutinaDto } from './dto/updateRutina.dto';
import { Rutina } from '../entities/rutina.entity';

@Controller('rutinas')
export class RutinasController {
  constructor(private readonly rutinasService: RutinasService) {}

  // ── CRUD estándar ──────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRutinaDto): Promise<Rutina> {
    return this.rutinasService.create(dto);
  }

  @Get()
  async findAll(): Promise<Rutina[]> {
    return this.rutinasService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Rutina> {
    return this.rutinasService.findOne(id);
  }

  // GET /rutinas/:id/ejercicios
  @Get(':id/ejercicios')
  async getWithExercises(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Rutina> {
    return this.rutinasService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRutinaDto,
  ): Promise<Rutina> {
    return this.rutinasService.update(id, dto);
  }

  @Put(':id')
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRutinaDto,
  ): Promise<Rutina> {
    return this.rutinasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.rutinasService.remove(id);
  }

  // ── Endpoints específicos de cliente ───────────────────────────────────

  /** Rutina activa de un cliente dado su usuario (requiere JWT) */
  @UseGuards(JwtAuthGuard)
  @Get('mi-rutina')
  async getRutinaClienteLogueado(
    @Req() req: Request & { user?: { id_usuario: number } },
  ): Promise<Rutina> {
    const userId = req.user?.id_usuario;
    if (typeof userId !== 'number') {
      throw new UnauthorizedException('No autorizado');
    }
    const rutina = await this.rutinasService.obtenerRutinaCliente(userId);
    if (!rutina) {
      throw new NotFoundException('No tienes una rutina activa');
    }
    return rutina;
  }

  /** Rutina activa de un cliente cualquiera */
  @Get('cliente/:usuarioId')
  async getRutinaDeCliente(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<Rutina | null> {
    return this.rutinasService.obtenerRutinaCliente(usuarioId);
  }

  /** Todas las rutinas (activa o no) de un cliente */
  @Get('cliente/:usuarioId/todas')
  async getRutinasDeCliente(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<Rutina[]> {
    return this.rutinasService.obtenerRutinasCliente(usuarioId);
  }
}
