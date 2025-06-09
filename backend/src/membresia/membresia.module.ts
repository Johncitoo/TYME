import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membresia } from '/entities/membresia.entity';
import { MembresiaService } from './membresia.service';
import { MembresiaController } from './membresia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Membresia])],
  controllers: [MembresiaController],
  providers: [MembresiaService],
  exports: [MembresiaService],
})
export class MembresiaModule {}
