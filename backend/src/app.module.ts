import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios'; 
import { UsuarioModule } from './usuario/usuario.module';
import { CabezaCirculoModule } from './cabeza-circulo/cabeza-circulo.module'; // Importar el módulo


@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'bd-crud-apoyos.cuxojb4u4gko.us-east-1.rds.amazonaws.com', // Endpoint de RDS
    port: 3306, // 
    username: 'admin',         //  
    password: '2YewJnmTwNf00Up',  // Contraseña Maestra
    database: 'crudApoyos',    // 
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,        // Lo mantenemos en false para producción
    logging: true,
  }),
    HttpModule, // Registrar HttpModule
    UsuarioModule,  // Registrar el módulo
    CabezaCirculoModule, // Registrar el módulo
  ],
})
export class AppModule {}