import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginResult } from './types/types.auth';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  @Inject()
  private readonly userService: UserService;

  @Inject()
  private readonly jwtService: JwtService;

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciais inválidas');

    const payload = { sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload);

    const { createdAt, password: _, id, ...result } = user;

    return { ...result, accessToken };
  }
}
