import { Controller, Get, Post, Body } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Get('resumen')
  async getResumen() {
    return this.pagosService.resumenPagos();
  }
  // === 1) Listar todas las boletas
  @Get()
  async findAll() {
    return this.pagosService.findAll();
  }

  @Post()
  async registrarPago(
    @Body()
    data: {
      fecha_pago: string;
      monto: number;
      id_cliente: number;
      metodo_pago: number; // id del método de pago
      observacion?: string;
      id_membresia: number;
    },
  ): Promise<any> {
    return await this.pagosService.registrarPago(data);
  }
}
