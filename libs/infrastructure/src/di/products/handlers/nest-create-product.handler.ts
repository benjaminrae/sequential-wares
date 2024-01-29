import { CreateProductCommand, CreateProductHandler } from '@app/application';
import { Product, Repository } from '@app/core';
import { Inject } from '@nestjs/common';
import { CommandHandler as NestCommandHandler } from '@nestjs/cqrs';
import { ProductsKeys } from '../product.keys';

@NestCommandHandler(CreateProductCommand)
export class NestCreateProductHandler extends CreateProductHandler {
  constructor(@Inject(ProductsKeys.PRODUCT_REPOSITORY) productRepository: Repository<Product>) {
    super(productRepository);
  }
}
