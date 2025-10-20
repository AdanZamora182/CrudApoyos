import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Entidad que representa la tabla 'cabezas_Circulo' en la base de datos
@Entity('cabezas_Circulo')
export class CabezaCirculo {
  // Clave primaria autoincremental
  @PrimaryGeneratedColumn()
  id: number;

  // Nombre de la cabeza de círculo
  @Column({ name: 'Nombre' })
  nombre: string;

  // Apellido paterno
  @Column({ name: 'Apellido_Paterno' })
  apellidoPaterno: string;

  // Apellido materno
  @Column({ name: 'Apellido_Materno' })
  apellidoMaterno: string;

  // Fecha de nacimiento (tipo date en la base de datos)
  @Column({ name: 'Fecha_Nacimiento', type: 'date' })
  fechaNacimiento: Date;

  // Número de teléfono (tipo bigint para números largos)
  @Column({ name: 'Telefono', type: 'bigint' })
  telefono: number;

  // Dirección: nombre de la calle
  @Column({ name: 'Calle' })
  calle: string;

  // Número exterior de la dirección (campo opcional)
  @Column({ name: 'No_Exterior', nullable: true })
  noExterior: number;

  // Número interior de la dirección
  @Column({ name: 'No_Interior' })
  noInterior: number;

  // Colonia donde reside
  @Column({ name: 'Colonia' })
  colonia: string;

  // Código postal de la dirección
  @Column({ name: 'Codigo_Postal' })
  codigoPostal: number;

  // Municipio (campo opcional)
  @Column({ name: 'Municipio', nullable: true })
  municipio: string;

  // Clave de elector única para identificación electoral
  @Column({ name: 'Clave_Elector', unique: true })
  claveElector: string;

  // Correo electrónico de contacto
  @Column({ name: 'Email' })
  email: string;

  // Perfil de Facebook (campo opcional)
  @Column({ name: 'Facebook', nullable: true })
  facebook: string;

  // Otra red social (campo opcional)
  @Column({ name: 'Otra_RedSocial', nullable: true })
  otraRedSocial: string;

  // Estructura territorial a la que pertenece
  @Column({ name: 'Estructura_Territorial' })
  estructuraTerritorial: string;

  // Posición dentro de la estructura territorial
  @Column({ name: 'Posicion_Estructura' })
  posicionEstructura: string;
}