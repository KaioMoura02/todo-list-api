import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @Inject()
  private readonly prisma: PrismaService;

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const hashPassword = await bcrypt.hash(data.password, 10);

    return await this.prisma.user.create({
      data: { ...data, password: hashPassword },
    });
  }

  async findUser(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(params: {
    id: string;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { id, data } = params;
    return await this.prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: string): Promise<User> {
    return await this.prisma.user.delete({ where: { id } });
  }
}
