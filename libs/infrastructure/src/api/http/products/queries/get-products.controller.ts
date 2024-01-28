import { GetProductsQuery } from '@app/application';
import { Mapper, Paginated, Product, Result } from '@app/core';
import { ProductsKeys } from '@app/infrastructure/di/products/product.keys';
import { ProductModel } from '@app/infrastructure/persistence/products/product.schema';
import { Controller, Get, HttpException, Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/products')
export class GetProductsController {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(ProductsKeys.PRODUCT_MAPPER) private productMapper: Mapper<Product, ProductModel>,
  ) {}

  @ApiOperation({ summary: 'Get products' })
  @Get()
  async getProducts() {
    const query = new GetProductsQuery({});
    const result = await this.queryBus.execute<GetProductsQuery, Result<Paginated<Product>>>(query);

    if (result.isFailure) {
      throw new HttpException(result.error!, 400);
    }

    return {
      total: result.value.total,
      data: result.value.data.map((product) => this.productMapper.toPresenter(product)),
    };
  }
}
