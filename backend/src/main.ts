// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Permite conexiones desde frontend web y móvil (Expo)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://host.docker.internal:5173',
      'http://localhost:3000',
      'http://localhost:8081',
      'http://localhost:19006',
      'http://192.168.1.105:5173',
      'http://192.168.1.105:3000',
      'http://192.168.1.105:19000',
      'exp://127.0.0.1:19000',
      'exp://localhost:19000',
      '*', // ⚠️ Permitir todos (útil para pruebas, puedes quitar en producción)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port, '0.0.0.0'); // necesario para aceptar peticiones externas (ej: desde Expo)
}
bootstrap();
