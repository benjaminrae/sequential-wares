import { JwtTokenService } from '@app/application';
import { AuthKeys } from '@app/infrastructure/di/auth.keys';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  const jwtTokenService = new JwtTokenService({ secret: 'secret', tokenExpiry: '10m' });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthKeys.TOKEN_SERVICE,
          useValue: jwtTokenService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('getToken should return a token with 10m expiry', () => {
    const testToken = 'token';
    jwtTokenService.generateToken = jest.fn().mockReturnValue(testToken);

    const result = controller.getToken();

    expect(result.token).toEqual(testToken);
    expect(jwtTokenService.generateToken).toHaveBeenCalledTimes(1);
  });
});
