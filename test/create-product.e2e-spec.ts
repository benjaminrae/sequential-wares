import { InfrastructureModule } from '@app/infrastructure';
import { ConfigModule } from '@app/infrastructure/config/config.module';
import { configuration } from '@app/infrastructure/config/configuration';
import { INestApplication } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';

let mongo: MongoMemoryServer;

afterAll(async () => {
  await mongo.stop();
});

describe('Create Product', () => {
  let app: INestApplication;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();

    const moduleFixture = await Test.createTestingModule({
      imports: [InfrastructureModule],
      providers: [
        {
          provide: ConfigModule,
          useValue: NestConfigModule.forRoot({
            load: [
              () => {
                const uri = mongo.getUri();
                const config = configuration();

                return {
                  ...config,
                  database: {
                    ...config.database,
                    uri,
                  },
                };
              },
            ],
          }),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /products should create a product', () => {
    return request(app.getHttpServer())
      .post('/products')
      .send()
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.created_at).toBeDefined();
      });
  });
});
