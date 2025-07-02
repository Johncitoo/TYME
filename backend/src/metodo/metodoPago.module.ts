// src/metodo-pago/metodo-pago.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodoPago } from '../entities/metodoPago.entiy';
import { MetodoPagoService } from './metodoPago.service';
import { MetodoPagoController } from './metodoPagoController';

@Module({
  imports: [TypeOrmModule.forFeature([MetodoPago])],
  providers: [MetodoPagoService],
  controllers: [MetodoPagoController],
  exports: [MetodoPagoService],
})
export class MetodoPagoModule {}
