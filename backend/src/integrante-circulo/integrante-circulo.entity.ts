import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CabezaCirculo } from '../cabeza-circulo/cabeza-circulo.entity';

@Entity('integrantes_Circulo')
export class IntegranteCirculo {
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

  @Column({ name: 'Calle' })
  calle: string;

  @Column({ name: 'No_Exterior', nullable: true })
  noExterior: number;

  @Column({ name: 'No_Interior', nullable: true })
  noInterior: number;

  @Column({ name: 'Colonia' })
  colonia: string;

  @Column({ name: 'Codigo_Postal', nullable: true }) 
  codigoPostal: number;

  @Column({ name: 'Municipio', nullable: true })
  municipio: string;

  @Column({ name: 'Clave_Elector', unique: true })
  claveElector: string;

  @Column({ name: 'Telefono', type: 'bigint' })
  telefono: number;

  @ManyToOne(() => CabezaCirculo, (cabezaCirculo) => cabezaCirculo.id, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'Lider_id' })
  lider: CabezaCirculo;
}