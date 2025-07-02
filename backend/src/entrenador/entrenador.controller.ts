// src/entrenador/entrenador.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EntrenadorService } from './entrenador.service';
import { DtoCrearEntrenador } from './dto/dto-crear-entrenador';
import { Entrenador } from '../entities/entrenador.entity';
import { TipoEspecialidad } from '../entities/tipo_especialidad.entity';

@Controller('entrenador')
export class EntrenadorController {
  constructor(private readonly entrenadorService: EntrenadorService) {}

  // 1) Listar todos los entrenadores (con usuario y especialidades).
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Entrenador[]> {
    return this.entrenadorService.findAll();
  }

  // 2) Listar todas las especialidades disponibles para un dropdown en el front.
  @Get('especialidades')
  @HttpCode(HttpStatus.OK)
  async listarEspecialidades(): Promise<TipoEspecialidad[]> {
    return this.entrenadorService.findAllEspecialidades();
  }

  // 3) Crear nuevo entrenador + usuario + especialidades.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: DtoCrearEntrenador): Promise<Entrenador> {
    return this.entrenadorService.create(dto);
  }

  @Get('activos')
  async findAllActivos(): Promise<Entrenador[]> {
    return this.entrenadorService.findAllActivos();
  }
}
