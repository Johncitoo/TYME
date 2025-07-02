import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clase')
@UseGuards(JwtAuthGuard)
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}

  @Post()
  async create(@Body() createClaseDto: CreateClaseDto) {
    return this.claseService.create(createClaseDto);
  }

  @Get()
  findAll() {
    return this.claseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.claseService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClaseDto: UpdateClaseDto) {
    return this.claseService.update(id, updateClaseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.claseService.remove(id);
  }

  // ENDPOINT PARA CLASES INSCRITAS DEL CLIENTE (PRÓXIMAS)
  @Get('cliente/:id/semana')
  findClasesInscritasSemana(@Param('id', ParseIntPipe) id: number) {
    return this.claseService.findClasesInscritasSemana(id);
  }
}
