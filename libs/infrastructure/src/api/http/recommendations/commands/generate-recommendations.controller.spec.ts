import { Recommendations, Result } from '@app/core';
import { RecommendationsKeys } from '@app/infrastructure/di/recommendations/recommendations.keys';
import { RecommendationsMapper } from '@app/infrastructure/di/recommendations/recommendations.mapper';
import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { GenerateRecommendationsController } from './generate-recommendations.controller';
import { GenerateRecommendationsDto } from './generate-recommendations.dto';

describe('GenerateRecommendationsController', () => {
  let controller: GenerateRecommendationsController;
  const commandBus = {
    execute: jest.fn(),
  };
  const recommendationsMapper = new RecommendationsMapper();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateRecommendationsController],
      providers: [
        {
          provide: CommandBus,
          useValue: commandBus,
        },
        {
          provide: RecommendationsKeys.RECOMMENDATIONS_MAPPER,
          useValue: recommendationsMapper,
        },
      ],
    }).compile();

    controller = module.get<GenerateRecommendationsController>(
      GenerateRecommendationsController,
    );
  });

  describe('generateRecommendations', () => {
    it('should execute a GenerateRecommendationsCommand and return the created recommendations', async () => {
      const originalProducts = ['1', '2', '3'];
      const generateRecommendationsDto = new GenerateRecommendationsDto();
      generateRecommendationsDto.products = originalProducts;
      const recommendedProducts = [
        ['1'],
        ['2'],
        ['3'],
        ['1', '2'],
        ['1', '3'],
        ['2', '3'],
        ['1', '2', '3'],
      ];
      const createdRecommendations = Recommendations.create({
        recommendedProducts,
      });
      const createdRecommendationsResponse = recommendationsMapper.toPresenter(
        createdRecommendations,
      );
      const commandResult = Result.ok(createdRecommendations);
      commandBus.execute.mockReturnValue(commandResult);

      const response = await controller.generateRecommendations(
        generateRecommendationsDto,
      );

      expect(commandBus.execute).toHaveBeenCalled();
      expect(response).toStrictEqual(createdRecommendationsResponse);
    });

    it('should throw an error if the command fails', async () => {
      const commandResult = Result.failure(new Error());
      commandBus.execute.mockReturnValue(commandResult);

      await expect(
        controller.generateRecommendations(new GenerateRecommendationsDto()),
      ).rejects.toThrow();
    });
  });
});
