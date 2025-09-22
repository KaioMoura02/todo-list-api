import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private readonly jwtService: JwtService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = this.extractTokenFromHeader(request);

    if (!authorization)
      throw new UnauthorizedException(
        'O usuário não tem autorização para acessar este conteúdo',
      );

    try {
      const payload = await this.jwtService.verifyAsync(authorization, {
        secret: process.env.JWT_SECRET,
      });
      request['sub'] = payload;
    } catch {
      throw new UnauthorizedException('Token necessário');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
