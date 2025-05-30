import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './user.entity';
import { TipoMembresia } from './tipo_membresia.entity';

@Entity('cliente')
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => TipoMembresia, { nullable: true })
  @JoinColumn({ name: 'id_tipo_membresia' })
  tipo_membresia: TipoMembresia;
}
