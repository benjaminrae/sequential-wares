import { RecommendationsModule } from '@app/infrastructure/di/recommendations/recommendations.module';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';

describe('Generate Recommendations', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;

  afterAll(async () => {
    await mongo.stop();

    await app.close();
  });

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();

    const moduleFixture = await Test.createTestingModule({
      imports: [RecommendationsModule, MongooseModule.forRoot(mongo.getUri())],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
      .send()
      .expect(400);
  });
});
