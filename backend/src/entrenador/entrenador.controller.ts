import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { EntrenadorService } from './entrenador.service';
import { DtoCrearEntrenador } from './dto/dto-crear-entrenador';
import { Entrenador } from '../entities/entrenador.entity';
import { TipoEspecialidad } from '../entities/tipo_especialidad.entity';

@Controller('entrenador')
export class EntrenadorController {
  constructor(private readonly entrenadorService: EntrenadorService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Entrenador[]> {
    return this.entrenadorService.findAll();
  }

  @Get('especialidades')
  @HttpCode(HttpStatus.OK)
  async listarEspecialidades(): Promise<TipoEspecialidad[]> {
    return this.entrenadorService.findAllEspecialidades();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: DtoCrearEntrenador): Promise<Entrenador> {
    return this.entrenadorService.create(dto);
  }

  @Get('activos')
  async findAllActivos(): Promise<Entrenador[]> {
    return this.entrenadorService.findAllActivos();
  }

  // ----> CORREGIDO:
  @Get('by-user/:id_usuario')
  async getByUser(@Param('id_usuario', ParseIntPipe) id_usuario: number) {
    return this.entrenadorService.findByUsuario(id_usuario);
  }
}
