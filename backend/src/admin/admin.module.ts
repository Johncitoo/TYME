// backend/src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/user.entity';
import { AdminService } from './dto/admin.service';
import { AdminController } from './admin.controller';
// IMPORTA AuthModule para poder usar JwtAuthGuard, RolesGuard y @Roles()
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    AuthModule, // <-- aquí
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
