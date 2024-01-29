import { GetProductsHandler, GetProductsQuery } from '@app/application';
import { Product, ReadRepository } from '@app/core';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { ProductsKeys } from '../product.keys';

@QueryHandler(GetProductsQuery)
export class NestGetProductsHandler extends GetProductsHandler {
  constructor(
    @Inject(ProductsKeys.PRODUCT_READ_REPOSITORY) productRepository: ReadRepository<Product>,
  ) {
    super(productRepository);
  }
}
