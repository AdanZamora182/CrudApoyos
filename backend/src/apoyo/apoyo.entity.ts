import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IntegranteCirculo } from '../integrante-circulo/integrante-circulo.entity';
import { CabezaCirculo } from '../cabeza-circulo/cabeza-circulo.entity';

@Entity('apoyos')
export class Apoyo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'Cantidad', type: 'int' })
  cantidad: number;

  @Column({ name: 'Tipo_Apoyo', length: 150 })
  tipoApoyo: string;

  @Column({ name: 'Fecha_Entrega', type: 'date' })
  fechaEntrega: Date;

  @ManyToOne(() => IntegranteCirculo, (integrante) => integrante.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Persona_id' })
  persona: IntegranteCirculo;

  @ManyToOne(() => CabezaCirculo, (cabeza) => cabeza.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Cabeza_id' })
  cabeza: CabezaCirculo;
}