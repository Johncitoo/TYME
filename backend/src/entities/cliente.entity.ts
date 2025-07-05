import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Usuario } from './user.entity';
import { TipoMembresia } from './tipo_membresia.entity';
import { Entrenador } from './entrenador.entity';
import { ClienteRutina } from './clienteRutina.entity';
import { Boleta } from './boleta.entity';
@Entity({ name: 'cliente' })
@Unique(['usuario'])
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'id_cliente' })
  id_cliente: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => TipoMembresia, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_tipo_membresia' })
  tipoMembresia: TipoMembresia;

  @ManyToOne(() => Entrenador, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_entrenador' })
  entrenador: Entrenador;

  @OneToMany(() => ClienteRutina, (cr) => cr.cliente)
  clientesRutinas: ClienteRutina[];

  @OneToMany(() => Boleta, (boleta) => boleta.cliente)
  boletas: Boleta[];
}
