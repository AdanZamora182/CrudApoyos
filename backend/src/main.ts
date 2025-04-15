import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:5173', // URL del frontend (React con Vite)
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  await app.listen(3000); // Puerto del backend
}
bootstrap();