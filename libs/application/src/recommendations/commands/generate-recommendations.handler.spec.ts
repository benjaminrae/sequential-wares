import { Recommendations, Result } from '@app/core';
import { FakeRepository } from '@app/core/shared/fake-repository';
import { GenerateRecommendationsCommand } from './generate-recommendations.command';
import { GenerateRecommendationsHandler } from './generate-recommendations.handler';

describe('GenerateRecommendationsHandler', () => {
  let repository = new FakeRepository<Recommendations>();

  beforeEach(() => {
    repository = new FakeRepository<Recommendations>();
    jest.clearAllMocks();
  });

  it('should generate recommendations and return a succesful result with the ordered recommendations', async () => {
    const products = ['1', '2', '3'];
    const expectedRecommendations = [
      ['1'],
      ['2'],
      ['3'],
      ['1', '2'],
      ['1', '3'],
      ['2', '3'],
      ['1', '2', '3'],
    ];
    const command = new GenerateRecommendationsCommand({ products });
    const handler = new GenerateRecommendationsHandler(repository);
    repository.create = jest.fn().mockResolvedValue(undefined);

    const result = (await handler.execute(command)) as Result<Recommendations>;

    expect(result.isSuccess).toBe(true);
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect((result.value as Recommendations).toObject().products).toStrictEqual(
      expectedRecommendations,
    );
  });

  it('should return a failure result if the recommendations cannot be generated', async () => {
    const products = ['1', '2', '3'];
    const command = new GenerateRecommendationsCommand({ products });
    const handler = new GenerateRecommendationsHandler(repository);
    repository.create = jest.fn().mockRejectedValue(new Error('test'));

    const result = await handler.execute(command);

    expect(result.isFailure).toBe(true);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });
});
