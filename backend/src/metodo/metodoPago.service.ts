// src/metodo-pago/metodo-pago.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPago } from '../entities/metodoPago.entiy';

@Injectable()
export class MetodoPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly metodoRepo: Repository<MetodoPago>,
  ) {}

  findAll(): Promise<MetodoPago[]> {
    return this.metodoRepo.find();
  }
}
