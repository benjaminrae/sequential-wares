import { Product, Result } from '@app/core';
import { ProductsKeys } from '@app/infrastructure/di/products/product.keys';
import { ProductMapper } from '@app/infrastructure/di/products/product.mapper';
import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductController } from './create-product.controller';

describe('CreateProductController', () => {
  let controller: CreateProductController;
  const commandBus = {
    execute: jest.fn(),
  };
  const productMapper = new ProductMapper();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateProductController],
      providers: [
        {
          provide: CommandBus,
          useValue: commandBus,
        },
        {
          provide: ProductsKeys.PRODUCT_MAPPER,
          useValue: productMapper,
        },
      ],
    }).compile();

    controller = module.get<CreateProductController>(CreateProductController);
  });

  describe('createProduct', () => {
    it('should execute a CreateProductCommand and return the created product', async () => {
      const createdProduct = Product.create({});
      const createdProductResponse = productMapper.toPresenter(createdProduct);
      const commandResult = Result.ok(createdProduct);
      commandBus.execute.mockReturnValue(commandResult);

      const response = await controller.createProduct();

      expect(commandBus.execute).toHaveBeenCalled();
      expect(response).toStrictEqual(createdProductResponse);
    });

    it('should throw an error if the command fails', async () => {
      const commandResult = Result.failure(new Error());
      commandBus.execute.mockReturnValue(commandResult);

      await expect(controller.createProduct()).rejects.toThrow();
    });
  });
});
