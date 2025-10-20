import { Entity, Column, PrimaryColumn } from 'typeorm';

// Entidad que representa la tabla 'usuarios' en la base de datos
@Entity('usuarios')
export class Usuario {
  // Clave primaria del usuario
  @PrimaryColumn()
  id: number;

  // Nombre del usuario
  @Column()
  nombre: string;

  // Apellidos del usuario
  @Column()
  apellidos: string;

  // Correo electrónico del usuario (campo opcional)
  @Column({ nullable: true })
  correo: string;

  // Nombre de usuario único para el login
  @Column()
  usuario: string;

  // Contraseña hasheada del usuario
  @Column()
  contraseña: string;

  // Código especial requerido para el registro de nuevos usuarios
  @Column()
  codigoUusuario: string;
}