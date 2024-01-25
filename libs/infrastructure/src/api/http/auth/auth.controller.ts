import { JwtTokenService } from '@app/application/auth/jwt-token.service';
import { AuthKeys } from '@app/infrastructure/di/auth.keys';
import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthKeys.TOKEN_SERVICE) private tokenService: JwtTokenService) {}

  @Get('token')
  getToken() {
    const token = this.tokenService.generateToken({});

    return {
      token,
    };
  }
}
