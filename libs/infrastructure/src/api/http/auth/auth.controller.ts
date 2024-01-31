import { JwtTokenService } from '@app/application/auth/jwt-token.service';
import { AuthKeys } from '@app/infrastructure/di/auth/auth.keys';
import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthKeys.TOKEN_SERVICE) private tokenService: JwtTokenService,
  ) {}

  @Get('token')
  @ApiOperation({ summary: 'Get token' })
  @ApiResponse({
    status: 200,
    description: 'Get token',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
        },
      },
    },
  })
  getToken() {
    const token = this.tokenService.generateToken({});

    return {
      token,
    };
  }
}
