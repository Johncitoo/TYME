// src/rutinas/rutina-ejercicio.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RutinaEjercicioService } from './rutinaEjercicio.service';
import { CreateRutinaEjercicioDto } from './dto/createRutinaEjercicio.dto';
import { UpdateRutinaEjercicioDto } from './dto/updateRutinaEjercicio.dto';

@Controller('rutina-ejercicios')
export class RutinaEjercicioController {
  constructor(private readonly svc: RutinaEjercicioService) {}

  @Post()
  create(@Body() dto: CreateRutinaEjercicioDto) {
    return this.svc.create(dto);
  }

  @Get('rutina/:id_rutina')
  findByRutina(@Param('id_rutina', ParseIntPipe) id_rutina: number) {
    return this.svc.findByRutina(id_rutina);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRutinaEjercicioDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  // NUEVO: Obtener rutina completa activa de un cliente
  @Get('cliente/:id_cliente')
  findRutinaCompletaByCliente(
    @Param('id_cliente', ParseIntPipe) id_cliente: number,
  ) {
    return this.svc.findRutinaCompletaByCliente(id_cliente);
  }
}
