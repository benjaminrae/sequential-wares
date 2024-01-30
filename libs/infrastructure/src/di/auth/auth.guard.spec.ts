import { JwtTokenService } from '@app/application';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const tokenService = new JwtTokenService({
    secret: 'secret',
    tokenExpiry: '1d',
  });

  describe('canActivate', () => {
    it('should return true if token is valid', async () => {
      const token = tokenService.generateToken({});

      const guard = new AuthGuard(tokenService);

      const request = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const result = await guard.canActivate({
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw an UnauthorizedException if token is invalid', async () => {
      const token = "I'm an invalid token";

      const guard = new AuthGuard(tokenService);

      const request = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      await expect(() =>
        guard.canActivate({
          switchToHttp: () => ({
            getRequest: () => request,
          }),
        } as ExecutionContext),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if Authorizaition header is missing', async () => {
      const guard = new AuthGuard(tokenService);

      const request = {
        headers: {},
      };

      await expect(() =>
        guard.canActivate({
          switchToHttp: () => ({
            getRequest: () => request,
          }),
        } as ExecutionContext),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
