import { Recommendations, Repository } from '@app/core';
import { RecommendationsKeys } from '@app/infrastructure/di/recommendations/recommendations.keys';
import { RecommendationsModule } from '@app/infrastructure/di/recommendations/recommendations.module';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';

describe('Get Recommendations', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;
  let recommendationsRepository: Repository<Recommendations>;
  let recommendations: Recommendations[];

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
    recommendationsRepository = app.get(
      RecommendationsKeys.RECOMMENDATIONS_REPOSITORY,
    );

    recommendations = [
      Recommendations.create({ recommendedProducts: [['1']] }),
      Recommendations.create({
        recommendedProducts: [['1'], ['2'], ['1', '2']],
      }),
      Recommendations.create({
        recommendedProducts: [
          ['1'],
          ['2'],
          ['3'],
          ['1', '2'],
          ['1', '3'],
          ['2', '3'],
          ['1', '2', '3'],
        ],
      }),
    ];

    for (const recommendation of recommendations) {
      await recommendationsRepository.create(recommendation);
    }
  });

  describe('GET /recommendations', () => {
    it('should return a list of recommendations ', async () => {
      return await request(app.getHttpServer())
        .get('/recommendations')
        .expect(200)
        .expect((res) => {
          expect(res.body.total).toBe(recommendations.length);
          expect(res.body.data).toHaveLength(recommendations.length);
          const [recommendation1, recommendation2, recommendation3] =
            res.body.data;
          expect(
            recommendations.some(
              (recommendation) =>
                recommendation.id.toString() === recommendation1.id,
            ),
          ).toBe(true);
          expect(
            recommendations.some(
              (recommendation) =>
                recommendation.id.toString() === recommendation2.id,
            ),
          ).toBe(true);
          expect(
            recommendations.some(
              (recommendation) =>
                recommendation.id.toString() === recommendation3.id,
            ),
          ).toBe(true);
        });
    });

    it('should return a list of recommendations with pagination', async () => {
      const limit = 1;
      const offset = 1;
      return await request(app.getHttpServer())
        .get(`/recommendations?limit=${limit}&offset=${offset}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.total).toBe(recommendations.length);
          expect(res.body.data).toHaveLength(limit);
        });
    });
  });
});
