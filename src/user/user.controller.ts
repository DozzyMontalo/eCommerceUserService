import { Body, Controller, Get, Patch, Param ,UseGuards, ParseIntPipe } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    @Get('me')
    getMe(@GetUser() user: User){
        return user;
    }

    @Get(':id')
    async getUserById(
      @Param('id', ParseIntPipe) id: number
    ) {
      return await this.userService.getUserById(id);
    }

    @Get()
    async getAllUsers() {
        const users = await this.userService.getAllUsers();
        return users;
    }

    @Patch()
    editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}
