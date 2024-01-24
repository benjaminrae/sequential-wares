import { InvalidProductError } from './errors/invalid-product.error';
import { Product } from './product.entity';
import { ProductProps } from './types';

describe('Product', () => {
  describe('create', () => {
    it('should create a product', () => {
      const product = Product.create({});

      expect(product).toBeInstanceOf(Product);
    });

    it('should throw an InvalidProduct error if the product is not empty', () => {
      const invalidProduct = { id: 'test' } as unknown as ProductProps;

      expect(() => Product.create(invalidProduct)).toThrow(InvalidProductError);
    });
  });
});
