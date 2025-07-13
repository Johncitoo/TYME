// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar validación automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // arroja error si llega algo extra
      transform: true, // convierte automáticamente tipos (p.ej: strings -> numbers)
    }),
  );

  // Habilitar CORS para tu frontend
  app.enableCors({
  origin: [
    'http://localhost:5173',
    'http://host.docker.internal:5173',
    'exp://127.0.0.1:19000',
    'exp://localhost:19000',
    'http://localhost:19006',
    'http://localhost:3000',
    'http://192.168.1.105:19000', // Expo Go en tu red local
    'http://192.168.1.105:3000',  // Backend en tu red local
    'http://192.168.1.105:5173', 
    'http://localhost:8081', // Si abres el front local desde otro dispositivo en la red
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});


  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
