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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables estén disponibles en toda la app
    }),
    // Conexión a la Base de Datos MySQL
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
        logging: true,
      }),
    }),
    // Conexión a MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        dbName: 'direccionesBD', 
      }),
    }),
    // Módulos de la aplicación
    HttpModule,
    UsuarioModule,
    CabezaCirculoModule,
    IntegranteCirculoModule,
    ApoyoModule,
    DireccionesModule,
  ],
})
export class AppModule {}