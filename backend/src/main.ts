import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar orígenes permitidos para CORS
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_PANEL_LOCAL || 'http://localhost:5174',
  ].filter(Boolean); // Filtrar valores undefined/null

  // Habilitar CORS con múltiples orígenes
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true,
  });

  // Puerto del backend desde variable de entorno
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
  console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
}
bootstrap();