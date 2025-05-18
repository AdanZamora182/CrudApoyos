import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cabezas_Circulo')
export class CabezaCirculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'Nombre' })
  nombre: string;

  @Column({ name: 'Apellido_Paterno' })
  apellidoPaterno: string;

  @Column({ name: 'Apellido_Materno' })
  apellidoMaterno: string;

  @Column({ name: 'Fecha_Nacimiento', type: 'date' })
  fechaNacimiento: Date;

  @Column({ name: 'Telefono', type: 'bigint' })
  telefono: number;

  @Column({ name: 'Calle' })
  calle: string;

  @Column({ name: 'No_Exterior', nullable: true })
  noExterior: number;

  @Column({ name: 'No_Interior' })
  noInterior: number;

  @Column({ name: 'Colonia' })
  colonia: string;

  @Column({ name: 'Codigo_Postal' })
  codigoPostal: number;

  @Column({ name: 'Municipio', nullable: true })
  municipio: string;

  @Column({ name: 'Clave_Elector', unique: true })
  claveElector: string;

  @Column({ name: 'Email' })
  email: string;

  @Column({ name: 'Facebook', nullable: true })
  facebook: string;

  @Column({ name: 'Otra_RedSocial', nullable: true })
  otraRedSocial: string;

  @Column({ name: 'Estructura_Territorial' })
  estructuraTerritorial: string;

  @Column({ name: 'Posicion_Estructura' })
  posicionEstructura: string;
}