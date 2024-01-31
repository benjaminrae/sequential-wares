import { JwtTokenService } from '@app/application';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthKeys } from './auth.keys';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthKeys.TOKEN_SERVICE)
    private readonly tokenService: JwtTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.tokenService.verifyToken(token);

      if (!payload) {
        throw new UnauthorizedException();
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractBearerToken(request: Request): string | undefined {
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      return;
    }

    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer') {
      return;
    }

    return token;
  }
}
