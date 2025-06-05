import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactoEmergencia } from '../entities/contacto_emergencia.entity';

@Injectable()
export class ContactoEmergenciaService {
  constructor(
    @InjectRepository(ContactoEmergencia)
    private readonly contactoRepo: Repository<ContactoEmergencia>,
  ) {}

  async create(data: Partial<ContactoEmergencia>) {
    const contacto = this.contactoRepo.create(data);
    return await this.contactoRepo.save(contacto);
  }

  async findAll() {
    return this.contactoRepo.find();
  }
}
