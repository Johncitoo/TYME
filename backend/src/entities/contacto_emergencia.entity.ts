import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('contacto_emergencia')
export class ContactoEmergencia {
  @PrimaryGeneratedColumn()
  id_contacto: number;

  @Column()
  telefono: string;

  @Column()
  relacion: string;

  @Column()
  nombre: string;

  @Column({ default: '' })
  direccion: string;
}
