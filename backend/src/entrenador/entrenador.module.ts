import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entrenador } from '../entities/entrenador.entity';
import { EntrenadorService } from './entrenador.service';
import { EntrenadorController } from './entrenador.controller';

@Module({
  imports: [
    // Registramos la entidad “Entrenador” en TypeORM para que se inyecte el repositorio
    TypeOrmModule.forFeature([Entrenador]),
  ],
  providers: [EntrenadorService],
  controllers: [EntrenadorController],
  exports: [EntrenadorService],
})
export class EntrenadorModule {}
