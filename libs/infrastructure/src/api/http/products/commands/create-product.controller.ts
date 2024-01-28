import { CreateProductCommand } from '@app/application';
import { Mapper, Product } from '@app/core';
import { ProductsKeys } from '@app/infrastructure/di/products/product.keys';
import { ProductModel } from '@app/infrastructure/persistence/products/product.schema';
import { Controller, HttpException, Inject, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Controller('/products')
export class CreateProductController {
  constructor(
    private commandBus: CommandBus,
    @Inject(ProductsKeys.PRODUCT_MAPPER) private productMapper: Mapper<Product, ProductModel>,
  ) {}

  @Post()
  async createProduct() {
    const command = new CreateProductCommand();
    const result = await this.commandBus.execute(command);

    if (result.isFailure) {
      throw new HttpException(result.error!, 400);
    }

    return this.productMapper.toPresenter(result.value);
  }
}