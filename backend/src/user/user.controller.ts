import { Controller, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './create-user.dto'
import { User } from './user.entity'
import { Get } from '@nestjs/common'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }
}
