import { Paginated, Recommendations, Result } from '@app/core';
import { RecommendationsKeys } from '@app/infrastructure/di/recommendations/recommendations.keys';
import { RecommendationsMapper } from '@app/infrastructure/di/recommendations/recommendations.mapper';
import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from '../../pagination.dto';
import { RecommendationsResponse } from '../recommendations.response';
import { GetRecommendationsController } from './get-recommendations.controller';

describe('GetRecommendationsController', () => {
  let controller: GetRecommendationsController;
  const queryBus = {
    execute: jest.fn(),
  };
  const recommendationsMapper = new RecommendationsMapper();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetRecommendationsController],
      providers: [
        {
          provide: QueryBus,
          useValue: queryBus,
        },
        {
          provide: RecommendationsKeys.RECOMMENDATIONS_MAPPER,
          useValue: recommendationsMapper,
        },
      ],
    }).compile();

    controller = module.get<GetRecommendationsController>(
      GetRecommendationsController,
    );
  });

  describe('getRecommendations', () => {
    it('should execute a GetRecommendationsQuery and return found recommendations', async () => {
      const recommendationsData = [
        Recommendations.create({ recommendedProducts: [['1']] }),
      ];
      const foundRecommendations: Paginated<Recommendations> = {
        data: recommendationsData,
        total: recommendationsData.length,
        limit: 10,
        offset: 0,
      };
      const foundRecommendationsResponse: Paginated<RecommendationsResponse> = {
        data: recommendationsData.map((recommendations) =>
          recommendationsMapper.toPresenter(recommendations),
        ),
        total: recommendationsData.length,
        limit: 10,
        offset: 0,
      };
      const queryResult = Result.ok(foundRecommendations);
      queryBus.execute.mockReturnValue(queryResult);
      const query = new PaginationDto<Recommendations>();

      const response = await controller.getRecommendations(query);

      expect(queryBus.execute).toHaveBeenCalled();
      expect(response).toStrictEqual(foundRecommendationsResponse);
    });

    it('should throw an error if the query fails', async () => {
      const queryResult = Result.failure(new Error());
      queryBus.execute.mockReturnValue(queryResult);
      const query = new PaginationDto<Recommendations>();

      await expect(controller.getRecommendations(query)).rejects.toThrow();
    });
  });
});
