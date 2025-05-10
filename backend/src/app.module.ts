import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Carga global de variables de entorno desde .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Configuración de TypeORM con PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // Busca automáticamente entidades con @Entity
      synchronize: true, // Solo en desarrollo. NO en producción
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
