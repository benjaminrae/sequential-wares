import { DomainError, Paginated, Product } from '@app/core';
import { FakeRepository } from '@app/core/shared/fake-repository';
import { GetProductsHandler } from './get-products.handler';
import { GetProductsQuery } from './get-products.query';

describe('GetProductsHandler', () => {
  let productReadRepository: FakeRepository<Product>;

  beforeEach(() => {
    productReadRepository = new FakeRepository<Product>();
  });

  describe('execute', () => {
    it('should return a successful result with a list of products', async () => {
      const product = Product.create({});
      const paginatedProducts: Paginated<Product> = {
        data: [product],
        total: 1,
      };
      const query = new GetProductsQuery({
        limit: 1,
        offset: 0,
        order: 'ASC',
        orderBy: 'id',
      });
      const handler = new GetProductsHandler(productReadRepository);
      productReadRepository.findMany = jest
        .fn()
        .mockResolvedValue(paginatedProducts);

      const result = await handler.execute(query);

      expect(result.isSuccess).toBe(true);
      expect(productReadRepository.findMany).toHaveBeenCalledWith(query);
      expect(result.value).toStrictEqual(paginatedProducts);
    });

    it('should return a failed result with a domain error', async () => {
      const resultError = new Error('Failed to get products');
      const query = new GetProductsQuery({
        limit: 1,
        offset: 0,
        order: 'ASC',
        orderBy: 'id',
      });
      const handler = new GetProductsHandler(productReadRepository);
      productReadRepository.findMany = jest
        .fn()
        .mockRejectedValue(new Error('Failed to get products'));

      const result = await handler.execute(query);

      expect(result.isFailure).toBe(true);
      expect(result.error).toStrictEqual(
        new DomainError({
          message: 'Failed to get products',
          details: {
            cause: resultError.message,
            origin: resultError.stack ?? 'GetProductsHandler',
            errors: [resultError],
          },
        }),
      );
    });
  });
});
