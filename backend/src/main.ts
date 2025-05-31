import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://support-management-system.s3-website-us-east-1.amazonaws.com', // URL del frontend

    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  await app.listen(3000); // Puerto del backend
}
bootstrap();