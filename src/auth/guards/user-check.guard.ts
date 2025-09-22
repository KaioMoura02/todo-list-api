import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['sub'].sub;

    if (!user || !user.sub)
      throw new NotFoundException('Usuário não autenticado');

    const userExists = await this.userService.findUserById(user.sub);

    if (!userExists) throw new NotFoundException('Usuário não encontrado');

    return true;
  }
}
