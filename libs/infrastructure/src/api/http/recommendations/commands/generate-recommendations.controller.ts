import { GenerateRecommendationsCommand } from '@app/application/recommendations';
import { Mapper, Recommendations } from '@app/core';
import { AuthGuard } from '@app/infrastructure/di/auth/auth.guard';
import { RecommendationsKeys } from '@app/infrastructure/di/recommendations/recommendations.keys';
import { RecommendationsModel } from '@app/infrastructure/persistence/recommendations/recommendations.schema';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecommendationsResponse } from '../recommendations.response';
import { GenerateRecommendationsDto } from './generate-recommendations.dto';

@UseGuards(AuthGuard)
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
      throw new HttpException(
        'Failed to generate recommendations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.recommendationsMapper.toPresenter(result.value);
  }
}
