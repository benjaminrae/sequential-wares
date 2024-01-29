import { DomainError, Recommendations } from '@app/core';
import { FakeRepository } from '@app/core/shared/fake-repository';
import { GetRecommendationsHandler } from './get-recommendations.handler';
import { GetRecommendationsQuery } from './get-recommendations.query';

describe('GetRecommendationsHandler', () => {
  let recommendationReadRepository: FakeRepository<Recommendations>;

  beforeEach(() => {
    recommendationReadRepository = new FakeRepository<Recommendations>();
  });

  describe('execute', () => {
    it('should return a successful result with a list of recommendations', async () => {
      const recommendedProducts = [
        ['1'],
        ['2'],
        ['3'],
        ['1', '2'],
        ['1', '3'],
        ['2', '3'],
        ['1', '2', '3'],
      ];
      const recommendation = Recommendations.create({ recommendedProducts });
      const paginatedRecommendations = {
        data: [recommendation],
        total: 1,
      };
      const query = new GetRecommendationsQuery({});
      const handler = new GetRecommendationsHandler(
        recommendationReadRepository,
      );
      recommendationReadRepository.findMany = jest
        .fn()
        .mockResolvedValue(paginatedRecommendations);

      const result = await handler.execute(query);

      expect(result.isSuccess).toBe(true);
      expect(recommendationReadRepository.findMany).toHaveBeenCalledWith(query);
      expect(result.value).toStrictEqual(paginatedRecommendations);
    });

    it('should return a failed result with a domain error', async () => {
      const resultError = new Error('Failed to get recommendations');
      const query = new GetRecommendationsQuery({});
      const handler = new GetRecommendationsHandler(
        recommendationReadRepository,
      );
      recommendationReadRepository.findMany = jest
        .fn()
        .mockRejectedValue(new Error('Failed to get recommendations'));

      const result = await handler.execute(query);

      expect(result.isFailure).toBe(true);
      expect(result.error).toStrictEqual(
        new DomainError({
          message: 'Failed to get recommendations',
          details: {
            cause: resultError.message,
            origin: resultError.stack ?? 'GetRecommendationsHandler',
            errors: [resultError],
          },
        }),
      );
    });
  });
});
