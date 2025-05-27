// src/user/user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Define TipoUsuario entity (minimal version, adjust fields as needed)
@Entity('tipo_usuario')
export class TipoUsuario {
  @PrimaryGeneratedColumn()
  id_tipo_usuario: number;

  @Column({ length: 50 })
  nombre: string;
}

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  correo: string;

  @Column()
  contrasena: string;

  // Agrega aquí los otros campos de tu tabla usuario según tu modelo:
  @Column({ nullable: true })
  primer_nombre: string;

  @Column({ nullable: true })
  segundo_nombre: string;

  @Column({ nullable: true })
  primer_apellido: string;

  @Column({ nullable: true })
  segundo_apellido: string;

  @Column({ nullable: true })
  telefono: string;

  @Column()
  cuerpo_rut: string;

  @Column()
  dv_rut: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true, type: 'date' })
  fecha_nacimiento: Date;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_registro: Date;

  @Column({ default: true })
  activo: boolean;

  @Column({ nullable: true })
  id_tipo_genero: number;

  @Column({ nullable: true })
  id_tipo_sexo: number;

  @Column({ nullable: true })
  id_contacto_emergencia: number;

  // Relación con tipo_usuario (foránea)
  @ManyToOne(() => TipoUsuario)
  @JoinColumn({ name: 'id_tipo_usuario' })
  tipo_usuario: TipoUsuario;
}
