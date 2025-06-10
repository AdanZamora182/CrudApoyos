import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios'; 
import { UsuarioModule } from './usuario/usuario.module';
import { CabezaCirculoModule } from './cabeza-circulo/cabeza-circulo.module'; // Importar el módulo
import { IntegranteCirculoModule } from './integrante-circulo/integrante-circulo.module';
import { ApoyoModule } from './apoyo/apoyo.module'; // Importar el módulo

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: '85.31.224.211', // Endpoint de RDS
    port: 3308, // 
    username: 'admin',         //  
    password: '2YewJnmTwNf00Up',  // Contraseña Maestra
    database: 'DB-Apoyos',    // 
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,        // Lo mantenemos en false para producción
    logging: true,
  }),
    HttpModule, // Registrar HttpModule
    UsuarioModule,  // Registrar el módulo
    CabezaCirculoModule,
    IntegranteCirculoModule, // Registrar el módulo
    ApoyoModule, // Registrar el módulo aquí
  ],
})
export class AppModule {}