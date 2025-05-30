import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// Importa todas tus entidades
import { Usuario } from './entities/user.entity';
import { TipoUsuario } from './entities/tipo_usuario.entity';
import { Cliente } from './entities/cliente.entity';
import { TipoMembresia } from './entities/tipo_membresia.entity'; // <-- FALTABA ESTE IMPORT
import { Membresia } from './entities/membresia.entity';
import { Ejercicio } from './entities/ejercicio.entity';
import { Rutina } from './entities/rutina.entity';

// Si tienes entidad Clase, Asistencia, etc., agrégalas aquí también
// import { Clase } from './entities/clase.entity';

// Importa los módulos principales
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClasesModule } from './clases/clases.module';
import { RutinasModule } from './rutinas/rutinas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      // Aquí van TODAS tus entidades que usarás con TypeORM
      entities: [
        Usuario,
        TipoUsuario,
        Cliente,
        TipoMembresia,
        Membresia,
        Ejercicio,
        Rutina,
        // Clase,
      ],
      synchronize: false, // IMPORTANTE: false en producción
    }),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    ClasesModule,
    RutinasModule,
  ],
})
export class AppModule {}
