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
  BadRequestException,
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

  // ── Endpoints de cliente: RUTINA DEL USUARIO ────────────────────────────
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
    // 1) Validar que idCliente venga en el body
    // Validación mínima
    if (!dto.id_entrenador) {
      throw new BadRequestException('id_entrenador es obligatorio');
    }
    if (!dto.id_cliente) {
      throw new BadRequestException('id_cliente es obligatorio');
    }
    if (!dto.fecha_inicio) {
      throw new BadRequestException('fecha_inicio es obligatorio');
    }

    // 2) Llamar al servicio con todo el DTO (incluye idCliente)
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
}