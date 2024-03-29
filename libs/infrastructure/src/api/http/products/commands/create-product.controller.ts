import { CreateProductCommand } from '@app/application';
import { Mapper, Product } from '@app/core';
import { ProductsKeys } from '@app/infrastructure/di/products/product.keys';
import { ProductModel } from '@app/infrastructure/persistence/products/product.schema';
import {
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductResponse } from '../product.response';

@ApiTags('products')
@Controller('/products')
export class CreateProductController {
  constructor(
    private commandBus: CommandBus,
    @Inject(ProductsKeys.PRODUCT_MAPPER)
    private productMapper: Mapper<Product, ProductModel>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({
    status: 201,
    description: 'Create product',
    type: ProductResponse,
  })
  async createProduct() {
    const command = new CreateProductCommand();
    const result = await this.commandBus.execute(command);

    if (result.isFailure) {
      throw new HttpException(result.error!, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return this.productMapper.toPresenter(result.value);
  }
}
