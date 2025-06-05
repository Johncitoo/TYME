import { Controller, Get } from '@nestjs/common';
import { MembresiaService } from './membresia.service';
import { Membresia } from '/entities/membresia.entity';

@Controller('membresia')
export class MembresiaController {
  constructor(private readonly membresiaService: MembresiaService) {}

  @Get()
  async findAll(): Promise<Membresia[]> {
    return this.membresiaService.findAll();
  }
}
