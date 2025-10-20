import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IntegranteCirculo } from '../integrante-circulo/integrante-circulo.entity';
import { CabezaCirculo } from '../cabeza-circulo/cabeza-circulo.entity';

// Entidad que representa la tabla 'apoyos' en la base de datos
@Entity('apoyos')
export class Apoyo {
  // Clave primaria autoincremental
  @PrimaryGeneratedColumn()
  id: number;

  // Cantidad de apoyos entregados (campo tipo entero)
  @Column({ name: 'Cantidad', type: 'int' })
  cantidad: number;

  // Tipo de apoyo entregado (máximo 150 caracteres)
  @Column({ name: 'Tipo_Apoyo', length: 150 })
  tipoApoyo: string;

  // Fecha en que se entregó el apoyo
  @Column({ name: 'Fecha_Entrega', type: 'date' })
  fechaEntrega: Date;

  // Relación muchos a uno con IntegranteCirculo (beneficiario del apoyo)
  // Se elimina en cascada si se elimina el integrante
  @ManyToOne(() => IntegranteCirculo, (integrante) => integrante.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Persona_id' })
  persona: IntegranteCirculo;

  // Relación muchos a uno con CabezaCirculo (beneficiario del apoyo)
  // Se elimina en cascada si se elimina la cabeza de círculo
  @ManyToOne(() => CabezaCirculo, (cabeza) => cabeza.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Cabeza_id' })
  cabeza: CabezaCirculo;
}