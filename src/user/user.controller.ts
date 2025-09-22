import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserService } from './user.service';
import { Prisma } from 'generated/prisma';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Post()
  async create(
    @Body() userdata: { email: string; name: string; password: string },
  ): Promise<CreateUserDto> {
    return this.userService.createUser(userdata);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findUser(@Param('id') id: string): Promise<CreateUserDto | null> {
    if (!id) return Promise.resolve({} as CreateUserDto);

    return this.userService
      .findUserById(id)
      .then((user) => (user ? user : Promise.resolve(null)));
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() data: Prisma.UserUpdateInput,
  ): Promise<CreateUserDto> {
    return this.userService.updateUser({ id, data });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
