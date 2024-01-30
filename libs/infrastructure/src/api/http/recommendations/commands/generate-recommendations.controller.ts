import { GenerateRecommendationsCommand } from '@app/application/recommendations';
import { Mapper, Recommendations } from '@app/core';
import { RecommendationsKeys } from '@app/infrastructure/di/recommendations/recommendations.keys';
import { RecommendationsModel } from '@app/infrastructure/persistence/recommendations/recommendations.schema';
import { Body, Controller, Inject, Post, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecommendationsResponse } from '../recommendations.response';
import { GenerateRecommendationsDto } from './generate-recommendations.dto';

@ApiTags('recommendations')
@Controller('recommendations')
export class GenerateRecommendationsController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(RecommendationsKeys.RECOMMENDATIONS_MAPPER)
    private readonly recommendationsMapper: Mapper<
      Recommendations,
      RecommendationsModel
    >,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Generate recommendations',
    type: RecommendationsResponse,
  })
  async generateRecommendations(
    @Body(new ValidationPipe())
    generateRecommendationsDto: GenerateRecommendationsDto,
  ) {
    const command = new GenerateRecommendationsCommand({
      products: Array.from(generateRecommendationsDto.products),
    });

    const result = await this.commandBus.execute(command);

    if (result.isFailure) {
    }

    return this.recommendationsMapper.toPresenter(result.value);
  }
}
