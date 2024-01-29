import { TokenPayload } from '@app/application';
import { ConfigModule } from '@app/infrastructure/config/config.module';
import { AuthModule } from '@app/infrastructure/di/auth/auth.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { decode } from 'jsonwebtoken';
import * as request from 'supertest';

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AuthModule, ConfigModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /auth/token should return a valid token with 10m expiry', () => {
    return request(app.getHttpServer())
      .get('/auth/token')
      .expect(200)
      .expect((res) => {
        expect(res.body.token).toBeDefined();

        const { iat, exp } = decode(res.body.token) as TokenPayload<unknown>;

        expect(iat).toBeDefined();
        expect(exp).toBeDefined();
        expect(exp! - iat!).toEqual(600);
      });
  });
});
