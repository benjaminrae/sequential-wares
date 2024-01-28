import { Mapper, Product } from '@app/core';
import { ProductModel } from '@app/infrastructure/persistence/products/product.schema';
import { MongooseRepositoryAdapter } from '@app/infrastructure/persistence/shared/mongoose-repository.adapter';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsKeys } from '../../di/products/product.keys';

@Injectable({})
export class ProductRepository extends MongooseRepositoryAdapter<Product, ProductModel> {
  constructor(
    @InjectModel(ProductModel.name) productModel: Model<ProductModel>,
    @Inject(ProductsKeys.PRODUCT_MAPPER) productMapper: Mapper<Product, ProductModel>,
  ) {
    super(productModel, productMapper);
  }
}
