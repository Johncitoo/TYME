import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// Módulos
import { AdminModule } from './admin/admin.module';
import { ContactoEmergenciaModule } from './contacto_emergencia/contacto_emergencia.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClasesModule } from './clases/clases.module';
import { RutinasModule } from './rutinas/rutinas.module';
import { MembresiaModule } from './membresia/membresia.module';
import { EntrenadorModule } from './entrenador/entrenador.module';

// Entidades
import { Usuario } from './entities/user.entity';
import { TipoUsuario } from './entities/tipo_usuario.entity';
import { Cliente } from './entities/cliente.entity';
import { TipoMembresia } from './entities/tipo_membresia.entity';
import { Membresia } from './entities/membresia.entity';
import { Ejercicio } from './entities/ejercicio.entity';
import { Rutina } from './entities/rutina.entity';
import { ContactoEmergencia } from './entities/contacto_emergencia.entity';
import { Entrenador } from './entities/entrenador.entity';
import { EntrenadorTipo } from './entities/entrenador_tipo.entity';
import { TipoEspecialidad } from './entities/tipo_especialidad.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT
        ? parseInt(process.env.DATABASE_PORT, 10)
        : 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        Usuario,
        TipoUsuario,
        Cliente,
        TipoMembresia,
        Membresia,
        Ejercicio,
        Rutina,
        ContactoEmergencia,
        Entrenador,
        EntrenadorTipo,
        TipoEspecialidad,
      ],
      synchronize: false, // en producción siempre false
    }),

    // Core
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,

    // Feature modules
    AdminModule,
    ContactoEmergenciaModule,
    ClasesModule,
    RutinasModule,
    MembresiaModule,
    EntrenadorModule,
  ],
})
export class AppModule {}