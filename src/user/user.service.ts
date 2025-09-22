import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, User } from 'generated/prisma';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @Inject()
  private readonly prisma: PrismaService;

  async createUser(data: Prisma.UserCreateInput): Promise<CreateUserDto> {
    const hasUser = await this.findUserByEmail(data.email);

    if (hasUser) throw new BadRequestException('Usuário já cadastrado');

    const hashPassword = await bcrypt.hash(data.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: { ...data, password: hashPassword },
      });

      return this.buildUser(user);
    } catch (error) {
      throw new BadRequestException('Erro ao cadastrar usuário');
    }
  }

  async findUserById(id: string): Promise<CreateUserDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new BadRequestException('Usuário não encontrado');

    return this.buildUser(user);
  }

  async findUserByEmail(email: string): Promise<CreateUserDto | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return this.buildUser(user);
  }

  async updateUser(params: {
    id: string;
    data: Prisma.UserUpdateInput;
  }): Promise<CreateUserDto> {
    const { id, data } = params;

    const user = await this.findUserById(id);

    if (!user) throw new BadRequestException('Usuário não encontrado');

    return await this.prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: string): Promise<CreateUserDto> {
    const user = await this.findUserById(id);

    if (!user) throw new BadRequestException('Usuário não encontrado');

    return await this.prisma.user.delete({ where: { id } });
  }

  private buildUser(user: User): CreateUserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
    };
  }
}
