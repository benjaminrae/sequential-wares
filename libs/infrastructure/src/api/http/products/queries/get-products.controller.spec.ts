import { Paginated, Product, Result } from '@app/core';
import { ProductsKeys } from '@app/infrastructure/di/products/product.keys';
import { ProductMapper } from '@app/infrastructure/di/products/product.mapper';
import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from '../../pagination.dto';
import { ProductResponse } from '../product.response';
import { GetProductsController } from './get-products.controller';

describe('GetProductsController', () => {
  let controller: GetProductsController;
  const queryBus = {
    execute: jest.fn(),
  };
  const productMapper = new ProductMapper();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetProductsController],
      providers: [
        {
          provide: QueryBus,
          useValue: queryBus,
        },
        {
          provide: ProductsKeys.PRODUCT_MAPPER,
          useValue: productMapper,
        },
      ],
    }).compile();

    controller = module.get<GetProductsController>(GetProductsController);
  });

  describe('getProducts', () => {
    it('should execute a GetProductsQuery and return found products', async () => {
      const productsData = [Product.create({})];
      const foundProducts: Paginated<Product> = {
        data: productsData,
        total: productsData.length,
        limit: 10,
        offset: 0,
      };
      const foundProductsResponse: Paginated<ProductResponse> = {
        data: productsData.map((product) => productMapper.toPresenter(product)),
        total: productsData.length,
        limit: 10,
        offset: 0,
      };
      const queryResult = Result.ok(foundProducts);
      queryBus.execute.mockReturnValue(queryResult);

      const response = await controller.getProducts(
        new PaginationDto<Product>(),
      );

      expect(queryBus.execute).toHaveBeenCalled();
      expect(response).toStrictEqual(foundProductsResponse);
    });

    it('should throw an error if the query fails', async () => {
      const queryResult = Result.failure(new Error());
      queryBus.execute.mockReturnValue(queryResult);

      await expect(
        controller.getProducts(new PaginationDto<Product>()),
      ).rejects.toThrow();
    });
  });
});
