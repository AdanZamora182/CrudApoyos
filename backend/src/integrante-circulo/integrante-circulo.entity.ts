import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CabezaCirculo } from '../cabeza-circulo/cabeza-circulo.entity';

// Entidad que representa la tabla 'integrantes_Circulo' en la base de datos
@Entity('integrantes_Circulo')
export class IntegranteCirculo {
  // Clave primaria autoincremental
  @PrimaryGeneratedColumn()
  id: number;

  // Nombre del integrante de círculo
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

  // Dirección: nombre de la calle
  @Column({ name: 'Calle' })
  calle: string;

  // Número exterior de la dirección (campo opcional)
  @Column({ name: 'No_Exterior', nullable: true })
  noExterior: number;

  // Número interior de la dirección (campo opcional)
  @Column({ name: 'No_Interior', nullable: true })
  noInterior: number;

  // Colonia donde reside
  @Column({ name: 'Colonia' })
  colonia: string;

  // Código postal de la dirección (campo opcional)
  @Column({ name: 'Codigo_Postal', nullable: true }) 
  codigoPostal: number;

  // Municipio (campo opcional)
  @Column({ name: 'Municipio', nullable: true })
  municipio: string;

  // Clave de elector única para identificación electoral
  @Column({ name: 'Clave_Elector', unique: true })
  claveElector: string;

  // Número de teléfono (tipo bigint para números largos)
  @Column({ name: 'Telefono', type: 'bigint' })
  telefono: number;

  // Relación muchos a uno con CabezaCirculo (líder del integrante)
  // Es opcional y se establece como NULL si se elimina la cabeza de círculo
  @ManyToOne(() => CabezaCirculo, (cabezaCirculo) => cabezaCirculo.id, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'Lider_id' })
  lider: CabezaCirculo;
}