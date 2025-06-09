// backend/src/membresia/membresia.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { MembresiaService } from './membresia.service';
import { Membresia } from '../entities/membresia.entity';

@Controller('membresia')
export class MembresiaController {
  constructor(private readonly membresiaService: MembresiaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Membresia[]> {
    return this.membresiaService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body()
    body: {
      nombre: string;
      descripcion?: string;
      precio: number;
      duracion_dias: number;
    },
  ): Promise<Membresia> {
    return this.membresiaService.create(body);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Membresia> {
    return this.membresiaService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    cambios: Partial<{
      nombre: string;
      descripcion: string;
      precio: number;
      duracion_dias: number;
    }>,
  ): Promise<Membresia> {
    return this.membresiaService.update(id, cambios);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.membresiaService.remove(id);
  }
}
