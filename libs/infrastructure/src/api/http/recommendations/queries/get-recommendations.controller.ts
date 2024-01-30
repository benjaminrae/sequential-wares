import { GetRecommendationsQuery } from '@app/application/recommendations';
import { Mapper, Paginated, Recommendations, Result } from '@app/core';
import { AuthGuard } from '@app/infrastructure/di/auth/auth.guard';
import { RecommendationsKeys } from '@app/infrastructure/di/recommendations/recommendations.keys';
import { RecommendationsModel } from '@app/infrastructure/persistence/recommendations/recommendations.schema';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from '../../pagination.dto';

@UseGuards(AuthGuard)
@Controller('/recommendations')
export class GetRecommendationsController {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(RecommendationsKeys.RECOMMENDATIONS_MAPPER)
    private readonly recommendationsMapper: Mapper<
      Recommendations,
      RecommendationsModel
    >,
  ) {}

  @ApiOperation({ summary: 'Get recommendations' })
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get recommendations',
    schema: {
      properties: {
        total: {
          type: 'number',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRecommendations(@Query() query: PaginationDto<Recommendations>) {
    const recommendationsQuery = new GetRecommendationsQuery({
      limit: query.limit,
      offset: query.offset,
      orderBy: query.orderBy,
      order: query.order,
    });

    const results = await this.queryBus.execute<
      GetRecommendationsQuery,
      Result<Paginated<Recommendations>>
    >(recommendationsQuery);

    if (results.isFailure) {
      throw new HttpException(
        'Failed to get recommendations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      total: results.value.total,
      limit: results.value.limit,
      offset: results.value.offset,
      data: results.value.data.map((recommendations) =>
        this.recommendationsMapper.toPresenter(recommendations),
      ),
    };
  }
}
