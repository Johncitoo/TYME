import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../user/user.entity'
import { LoginDto } from '../dto/login.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(loginDto: LoginDto) {
  const { email, password } = loginDto

  const user = await this.userRepository.findOne({
    where: { email },
    relations: ['tipo'], // Asegúrate de incluir la relación con `user_type`
  })

  if (!user) {
    throw new UnauthorizedException('Invalid credentials')
  }

  const passwordValid = await bcrypt.compare(password, user.password)

  if (!passwordValid) {
    throw new UnauthorizedException('Invalid credentials')
  }

  // Aquí estamos verificando si el tipo de usuario es 'admin'
  const role = user.tipo?.name || 'user' // 'tipo' es la relación con 'user_type'

  return {
    id: user.id_usuario,
    email: user.email,
    firstName: user.firstName,
    role: role,
  }
}



}
