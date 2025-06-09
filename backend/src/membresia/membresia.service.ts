import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membresia } from '/entities/membresia.entity';

@Injectable()
export class MembresiaService {
  constructor(
    @InjectRepository(Membresia)
    private membresiaRepository: Repository<Membresia>,
  ) {}

  async findAll(): Promise<Membresia[]> {
    return this.membresiaRepository.find();
  }
}
