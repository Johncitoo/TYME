import { Controller, Post, Body, Get } from '@nestjs/common';
import { ContactoEmergenciaService } from './contacto_emergencia.service';

@Controller('contacto_emergencia')
export class ContactoEmergenciaController {
  constructor(private readonly contactoService: ContactoEmergenciaService) {}

  @Post()
  async create(@Body() dto: any) {
    return this.contactoService.create(dto);
  }

  @Get()
  async findAll() {
    return this.contactoService.findAll();
  }
}
