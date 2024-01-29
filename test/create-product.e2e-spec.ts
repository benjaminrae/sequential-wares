import { ProductsModule } from '@app/infrastructure/di/products/products.module';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';

describe('Create Product', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;

  afterAll(async () => {
    await mongo.stop();

    await app.close();
  });

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();

    const moduleFixture = await Test.createTestingModule({
      imports: [ProductsModule, MongooseModule.forRoot(mongo.getUri())],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /products should create a product', async () => {
    return await request(app.getHttpServer())
      .post('/products')
      .send()
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.created_at).toBeDefined();
      });
  });
});
