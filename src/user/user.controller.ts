import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User as UserModel } from 'generated/prisma';

@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Post()
  async create(
    @Body() userdata: { email: string; name: string; password: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userdata);
  }

  @Get(':id')
  async findUser(@Param('id') id: string): Promise<UserModel | null> {
    if (!id) {
      return Promise.resolve({} as UserModel);
    }

    return this.userService
      .findUser(id)
      .then((user) => (user ? user : Promise.resolve(null)));
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.userService.updateUser({ id, data });
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
