import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { User } from '../../user/user.entity'
import { UserType } from 'src/user/user-type.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User,UserType])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
