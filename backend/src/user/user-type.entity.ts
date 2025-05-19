import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('tipo_usuario')
export class UserType {
  @PrimaryGeneratedColumn({ name: 'id_tipo' })
  id: number

  @Column({ name: 'nombre' })
  name: string
}
