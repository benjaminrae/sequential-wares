import { UniqueIdentifier } from '../shared';
import { Entity } from '../shared/entity';
import { InvalidProductError } from './errors/invalid-product.error';
import { ProductProps } from './types';

export class Product extends Entity<ProductProps> {
  public static create(props: ProductProps): Product {
    return new Product({ id: new UniqueIdentifier(), props });
  }

  protected validate(props: ProductProps): void {
    if (Object.keys(props).length > 0) {
      throw new InvalidProductError('Product cannot have properties');
    }
  }
}
