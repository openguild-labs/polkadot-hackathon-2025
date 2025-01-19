import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@Controller({ version: '1', path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id/profile')
  showProfile(@Param('id') userId: string) {
    return this.userService.getUserDetails(userId);
  }

  @Get(':name/profileByName')
  showProfileByName(@Param('name') name: string) {
    return this.userService.getUserbyName(name);
  }

  @Post('profile')
  createNewProfile(@Body() data: CreateUserDto) {
    return this.userService.createNewUser(data);
  }

  @Patch(':id/profile')
  updateProfile(@Param('id') userId: string, @Body() data: UpdateUserDto) {
    return this.userService.updateUser(userId, data);
  }

  @Get()
  getAllUser() {
    return this.userService.findAll();
  }
}
