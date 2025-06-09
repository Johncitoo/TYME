// src/clases/clases.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clase } from '../entities/clase.entity';      // Ajusta la ruta si es necesario
import { Cliente } from '../entities/cliente.entity';  // Ajusta la ruta si es necesario
import { ClasesService } from './clases.service';
import { ClasesController } from './clases.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Clase, Cliente])],  // <<----- ¡Esto es lo importante!
  providers: [ClasesService],
  controllers: [ClasesController],
  exports: [ClasesService], // Opcional, solo si quieres usarlo en otros módulos
})
export class ClasesModule {}
