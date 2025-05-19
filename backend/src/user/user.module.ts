import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { User } from './user.entity'
import { UserType } from './user-type.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User,UserType])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
