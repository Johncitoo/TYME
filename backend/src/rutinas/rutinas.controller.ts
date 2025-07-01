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
  UnauthorizedException,
  NotFoundException,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { RutinasService } from './rutinas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { CreateRutinaDto } from './dto/create-rutina.dto';
import { UpdateRutinaDto } from './dto/update-rutina.dto';
import { Rutina } from '../entities/rutina.entity';

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
