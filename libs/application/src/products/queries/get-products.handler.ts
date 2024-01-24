import { DomainError, Paginated, Product, ReadRepository } from '@app/core';
import { QueryHandler } from '@app/core/shared/query';
import { Result } from '@app/core/shared/result';
import { GetProductsQuery } from './get-products.query';

export class GetProductsHandler implements QueryHandler<GetProductsQuery> {
  constructor(private readonly productReadRepository: ReadRepository<Product>) {}

  async execute(query: GetProductsQuery): Promise<Result<Paginated<Product> | DomainError>> {
    try {
      const data = await this.productReadRepository.findMany(query);

      return Result.ok(data);
    } catch (error) {
      return Result.failure(
        new DomainError({
          message: 'Failed to get products',
          details: {
            cause: error,
            origin: error.stack ?? 'GetProductsHandler',
            errors: [error],
          },
        }),
      );
    }
  }
}
