import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('usuarios') // nombre exacto de la tabla en la BD
export class Usuario {
  @PrimaryColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column({ nullable: true })
  correo: string;

  @Column()
  usuario: string;

  @Column()
  contraseña: string;

  @Column()
  codigoUusuario: string;
}