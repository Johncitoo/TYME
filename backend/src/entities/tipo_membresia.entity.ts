import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tipo_membresia' })
export class TipoMembresia {
  @PrimaryGeneratedColumn({ name: 'id_tipo_membresia' })
  id_tipo_membresia: number;

  // Nombre único, hasta 50 caracteres
  @Column({ length: 50, unique: true })
  nombre: string;

  // Descripción opcional, tipo texto con valor por defecto vacío
  @Column({ type: 'text', nullable: true, default: '' })
  descripcion: string;
}
