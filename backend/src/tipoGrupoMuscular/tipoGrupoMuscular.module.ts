import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoGrupoMuscularService } from './tipoGrupoMuscular.service';
import { TipoGrupoMuscularController } from './tipoGrupoMuscular.controller';
import { TipoGrupoMuscular } from '../entities/tipoGrupoMuscular.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoGrupoMuscular])],
  providers: [TipoGrupoMuscularService],
  controllers: [TipoGrupoMuscularController],
  exports: [TipoGrupoMuscularService],
})
export class TipoGrupoMuscularModule {}
