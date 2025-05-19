import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { UserType } from './user-type.entity'

@Entity('usuario')
export class User {
  @PrimaryGeneratedColumn()
  id_usuario: number

  @Column({ name: 'correo' })
  email: string

  @Column({ name: 'contraseña' })
  password: string

  @Column({ name: 'primer_nombre' })
  firstName: string

  @Column({ name: 'primer_apellido' })
  lastName: string

  @Column({ name: 'rut_cuerpo' })
  rutBody: string

  @Column({ name: 'rut_dv' })
  rutDv: string

  @Column()
  user_type_id: number

  @ManyToOne(() => UserType)
  @JoinColumn({ name: 'user_type_id' }) // nombre real de la FK en BD
  tipo: UserType
}
