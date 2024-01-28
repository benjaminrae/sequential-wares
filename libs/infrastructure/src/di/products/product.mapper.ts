import { Mapper, Product, UniqueIdentifier } from '@app/core';
import { ProductResponse } from '@app/infrastructure/api/http/products/product.response';
import { ProductModel } from '../../persistence/products/product.schema';

export class ProductMapper implements Mapper<Product, ProductModel> {
  toDomain(data: ProductModel): Product {
    return new Product({
      id: new UniqueIdentifier(data.id),
      createdAt: data.createdAt,
      props: {},
    });
  }

  toPersistence(domainEntity: Product): ProductModel {
    const model = new ProductModel();
    model.id = domainEntity.id.toString();
    model.createdAt = domainEntity.createdAt;

    return model;
  }

  toPresenter(domainEntity: Product): ProductResponse {
    return new ProductResponse({
      id: domainEntity.id.toString(),
      created_at: domainEntity.createdAt,
    });
  }
}
