// src/metodo-pago/metodo-pago.controller.ts
import { Controller, Get } from '@nestjs/common';
import { MetodoPagoService } from './metodoPago.service';

@Controller('tipo-metodo-pago')
export class MetodoPagoController {
  constructor(private readonly metodoPagoService: MetodoPagoService) {}

  @Get()
  getAll() {
    return this.metodoPagoService.findAll();
  }
}
