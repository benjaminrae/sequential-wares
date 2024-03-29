import { JwtTokenService } from '@app/application';
import { ConfigModule } from '@app/infrastructure/config/config.module';
import { AuthKeys } from '@app/infrastructure/di/auth/auth.keys';
import { AuthModule } from '@app/infrastructure/di/auth/auth.module';
import { RecommendationsModule } from '@app/infrastructure/di/recommendations/recommendations.module';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';

describe('Generate Recommendations', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;
  let tokenService: JwtTokenService;
  let token: string;

  afterAll(async () => {
    await mongo.stop();

    await app.close();
  });

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();

    const moduleFixture = await Test.createTestingModule({
      imports: [
        RecommendationsModule,
        MongooseModule.forRoot(mongo.getUri()),
        AuthModule,
        ConfigModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    tokenService = app.get(AuthKeys.TOKEN_SERVICE);

    token = tokenService.generateToken({});
  });

  it('POST /recommendations should generate recommendations', async () => {
    const products = ['1', '2', '3'];
    const expectedRecommendations = [
      ['1'],
      ['2'],
      ['3'],
      ['1', '2'],
      ['1', '3'],
      ['2', '3'],
      ['1', '2', '3'],
    ];

    return await request(app.getHttpServer())
      .post('/recommendations')
      .set('Authorization', `Bearer ${token}`)
      .send({ products })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.created_at).toBeDefined();
        expect(res.body.recommended_products).toEqual(expectedRecommendations);
      });
  });

  it('POST /recommendations should return an error if the products are not provided', async () => {
    return await request(app.getHttpServer())
      .post('/recommendations')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(400);
  });

  it('should return 401 "Unauthorized" if the request is not authenticated', async () => {
    return await request(app.getHttpServer())
      .get('/recommendations')
      .expect(401);
  });
});
