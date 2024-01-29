import { Product, Repository } from '@app/core';
import { ProductsKeys } from '@app/infrastructure/di/products/product.keys';
import { ProductsModule } from '@app/infrastructure/di/products/products.module';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';

describe('Get Products', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;
  let productRepository: Repository<Product>;

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
    productRepository = app.get(ProductsKeys.PRODUCT_REPOSITORY);
  });

  it('GET /products should return a list of products', async () => {
    const products = [
      Product.create({}),
      Product.create({}),
      Product.create({}),
    ];
    for (const product of products) {
      await productRepository.create(product);
    }

    return await request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(res.body.total).toBe(products.length);
        expect(res.body.data).toHaveLength(products.length);
        const [product1, product2, product3] = res.body.data;
        expect(
          products.some((product) => product.id.toString() === product1.id),
        ).toBe(true);
        expect(
          products.some((product) => product.id.toString() === product2.id),
        ).toBe(true);
        expect(
          products.some((product) => product.id.toString() === product3.id),
        ).toBe(true);
      });
  });
});
