import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { EjercicioService, EjercicioDto } from './ejercicio.service';
import { CreateEjercicioDto } from './dto/createEjercicio.dto';
import { UpdateEjercicioDto } from './dto/updateEjercicio.dto';

@Controller('ejercicios')
export class EjercicioController {
  constructor(private readonly service: EjercicioService) {}

  @Post()
  create(@Body() dto: CreateEjercicioDto): Promise<EjercicioDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<EjercicioDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<EjercicioDto> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEjercicioDto,
  ): Promise<EjercicioDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
