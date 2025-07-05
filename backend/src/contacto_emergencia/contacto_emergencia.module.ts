import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoEmergencia } from '../entities/contacto_emergencia.entity';
import { ContactoEmergenciaService } from './contacto_emergencia.service';
import { ContactoEmergenciaController } from './contacto_emergencia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContactoEmergencia])],
  providers: [ContactoEmergenciaService],
  controllers: [ContactoEmergenciaController],
  exports: [ContactoEmergenciaService],
})
export class ContactoEmergenciaModule {}
