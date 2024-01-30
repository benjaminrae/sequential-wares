import { GetProductsQuery } from '@app/application';
import { Mapper, Paginated, Product, Result } from '@app/core';
import { ProductsKeys } from '@app/infrastructure/di/products/product.keys';
import { ProductModel } from '@app/infrastructure/persistence/products/product.schema';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../../pagination.dto';

@ApiTags('products')
@Controller('/products')
export class GetProductsController {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(ProductsKeys.PRODUCT_MAPPER)
    private productMapper: Mapper<Product, ProductModel>,
  ) {}

  @ApiOperation({ summary: 'Get products' })
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get products',
    schema: {
      properties: {
        total: {
          type: 'number',
        },
        limit: {
          type: 'number',
        },
        offset: {
          type: 'number',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProducts(
    @Query()
    query: PaginationDto<Product>,
  ) {
    const productsQuery = new GetProductsQuery(query);
    const result = await this.queryBus.execute<
      GetProductsQuery,
      Result<Paginated<Product>>
    >(productsQuery);

    if (result.isFailure) {
      throw new HttpException(result.error!, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      total: result.value.total,
      limit: result.value.limit,
      offset: result.value.offset,
      data: result.value.data.map((product) =>
        this.productMapper.toPresenter(product),
      ),
    };
  }
}
