import { JwtTokenService } from '@app/application/auth/jwt-token.service';
import { AuthKeys } from '@app/infrastructure/di/auth/auth.keys';
import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '../../api/http/auth/auth.controller';
import { AuthGuard } from './auth.guard';

const providers: Provider[] = [
  {
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const secret = configService.get('jwtSecret');

      return new JwtTokenService({ secret: secret, tokenExpiry: '10m' });
    },
    provide: AuthKeys.TOKEN_SERVICE,
  },
  AuthGuard,
];

@Module({
  providers,
  controllers: [AuthController],
  exports: [AuthGuard, AuthKeys.TOKEN_SERVICE],
})
export class AuthModule {}
