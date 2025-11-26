import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioModule } from './usuario/usuario.module';
import { CabezaCirculoModule } from './cabeza-circulo/cabeza-circulo.module';
import { IntegranteCirculoModule } from './integrante-circulo/integrante-circulo.module';
import { ApoyoModule } from './apoyo/apoyo.module';
import { DireccionesModule } from './direcciones/direcciones.module';
import { DatabaseHealthModule } from './database/database-health.module';
import { DashboardModule } from './dashboard/dashboard.module';

const enableMongo = (process.env.MONGO_ENABLED ?? 'true') !== 'false' && !!process.env.MONGO_URI?.trim();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables estén disponibles en toda la app
    }),
    // Conexión a la Base de Datos MySQL con configuración robusta
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT'), 10),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: ['error', 'warn'], // Solo logs de errores y warnings para producción
        // Configuración de pool de conexiones optimizada
        extra: {
          // Pool de conexiones
          connectionLimit: 10, // Número máximo de conexiones
          waitForConnections: true, // Esperar si no hay conexiones disponibles
          queueLimit: 0, // Sin límite de cola
          
          // Timeouts (en milisegundos)
          connectTimeout: 60000, // 60 segundos para conectar
          
          // Keep-alive para mantener conexiones vivas
          enableKeepAlive: true,
          keepAliveInitialDelay: 0, // Iniciar keep-alive inmediatamente
          
          // Importante: validar conexiones antes de usarlas
          // Esto hace un ping automático antes de cada query
          idleTimeoutMillis: 30000, // 30 segundos de inactividad
          maxLifetime: 1800000, // 30 minutos vida máxima de conexión
        },
        // Configuraciones adicionales para estabilidad
        charset: 'utf8mb4',
        timezone: 'local',
        bigNumberStrings: false,
        supportBigNumbers: true,
      }),
    }),
    // Conexión a MongoDB (solo si MONGO_URI está presente)
    ...(enableMongo ? [
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const uri = config.get<string>('MONGO_URI');
          return {
            uri,
            dbName: 'direccionesBD',
            // Configuraciones de conexión
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            autoIndex: false,
            // No dejar que errores matén el proceso; loguear y permitir desconexiones
            connectionFactory: (connection) => {
              connection.on('error', (err) => {
                console.error('[Mongoose] connection error:', err?.message ?? err);
              });
              connection.on('disconnected', () => {
                console.warn('[Mongoose] disconnected');
              });
              connection.on('connected', () => {
                console.log('[Mongoose] connected to', uri);
              });
              return connection;
            },
          };
        },
      }),
      DireccionesModule,
    ] : []),
    // Módulo de monitoreo de salud de la base de datos
    DatabaseHealthModule,
    // Módulos de la aplicación
    HttpModule,
    UsuarioModule,
    CabezaCirculoModule,
    IntegranteCirculoModule,
    ApoyoModule,
    DashboardModule,
  ],
})
export class AppModule {}