import {
  DomainError,
  Paginated,
  ReadRepository,
  Recommendations,
  Result,
} from '@app/core';
import { QueryHandler } from '@app/core/shared/query';
import { GetRecommendationsQuery } from './get-recommendations.query';

export class GetRecommendationsHandler
  implements QueryHandler<GetRecommendationsQuery>
{
  constructor(
    private readonly recommendationsReadRepository: ReadRepository<Recommendations>,
  ) {}

  async execute(
    query: GetRecommendationsQuery,
  ): Promise<Result<Paginated<Recommendations> | DomainError>> {
    try {
      const data = await this.recommendationsReadRepository.findMany(query);

      return Result.ok(data);
    } catch (error) {
      return Result.failure(
        new DomainError({
          message: 'Failed to get recommendations',
          details: {
            cause: error,
            origin: error.stack ?? this.constructor.name,
            errors: [error],
          },
        }),
      );
    }
  }
}
