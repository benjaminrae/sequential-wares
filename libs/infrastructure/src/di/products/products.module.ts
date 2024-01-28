import { CreateProductController } from '@app/infrastructure/api/http/products/commands/create-product.controller';
import { GetProductsController } from '@app/infrastructure/api/http/products/queries/get-products.controller';
import { ProductReadRepository } from '@app/infrastructure/persistence/products/product-read.repository';
import { ProductRepository } from '@app/infrastructure/persistence/products/product.repository';
import {
  ProductModel,
  ProductSchema,
} from '@app/infrastructure/persistence/products/product.schema';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { NestCreateProductHandler } from './handlers/nest-create-product.handler';
import { NestGetProductsHandler } from './handlers/nest-get-products.handler';
import { ProductsKeys } from './product.keys';
import { ProductMapper } from './product.mapper';

const repositories: Provider[] = [
  {
    provide: ProductsKeys.PRODUCT_REPOSITORY,
    useClass: ProductRepository,
  },
  {
    provide: ProductsKeys.PRODUCT_READ_REPOSITORY,
    useClass: ProductReadRepository,
  },
];

export const mappers: Provider[] = [
  {
    provide: ProductsKeys.PRODUCT_MAPPER,
    useFactory: () => {
      return new ProductMapper();
    },
  },
];

export const models: Provider[] = [
  {
    provide: ProductsKeys.PRODUCT_MODEL,
    useValue: ProductModel,
  },
];

export const handlers: Provider[] = [NestCreateProductHandler, NestGetProductsHandler];

export const controllers = [CreateProductController, GetProductsController];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProductModel.name, schema: ProductSchema }]),
    CqrsModule,
  ],
  controllers: [...controllers],
  providers: [...models, ...repositories, ...mappers, ...handlers],
})
export class ProductsModule {}
