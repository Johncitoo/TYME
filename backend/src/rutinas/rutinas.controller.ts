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

<<<<<<< HEAD
  // ── Endpoints de cliente: RUTINA DEL USUARIO ────────────────────────────
=======
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

  // ── Endpoints específicos de cliente ───────────────────────────────────

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
>>>>>>> 59c662f4bcad158c8d9ea18b4c35b116adba064f
  @UseGuards(JwtAuthGuard)
  @Get('mi-rutina')
  async getRutinaClienteLogueado(
    @Req() req: Request & { user?: { id_usuario: number } },
  ): Promise<Rutina> {
    if (!req.user?.id_usuario) {
      throw new UnauthorizedException('No autorizado');
    }
    const r = await this.rutinasService.obtenerRutinaCliente(
      req.user.id_usuario,
    );
    if (!r) throw new NotFoundException('No tienes una rutina activa');
    return r;
  }

<<<<<<< HEAD
  /** Todas las rutinas de un cliente dado su ID de usuario */
  @Get('cliente/:usuarioId/todas')
  async getRutinasDeCliente(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<Rutina[]> {
    const rutinas = await this.rutinasService.obtenerRutinasCliente(usuarioId);
    if (!rutinas.length) {
      throw new NotFoundException(
        'No se encontraron rutinas para este usuario',
      );
    }
    return rutinas;
  }

  /** Rutina activa de un cliente cualquiera */
  @Get('cliente/:usuarioId')
  async getRutinaDeCliente(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<Rutina | null> {
    return this.rutinasService.obtenerRutinaCliente(usuarioId);
  }

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

  // <— Ahora el dinámico ID va después de “mi-rutina” y “cliente/...”
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Rutina> {
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
    return this.rutinasService.remove(id);
  }
=======
  // ...otros endpoints que puedas necesitar...
>>>>>>> 59c662f4bcad158c8d9ea18b4c35b116adba064f
}
