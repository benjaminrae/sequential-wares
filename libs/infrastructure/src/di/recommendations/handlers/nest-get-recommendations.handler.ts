import {
  GetRecommendationsHandler,
  GetRecommendationsQuery,
} from '@app/application/recommendations';
import { ReadRepository, Recommendations } from '@app/core';
import { Inject } from '@nestjs/common';
import { QueryHandler as NestQueryHandler } from '@nestjs/cqrs';
import { RecommendationsKeys } from '../recommendations.keys';

@NestQueryHandler(GetRecommendationsQuery)
export class NestGetRecommendationsHandler extends GetRecommendationsHandler {
  constructor(
    @Inject(RecommendationsKeys.RECOMMENDATIONS_READ_REPOSITORY)
    recommendationsReadRepository: ReadRepository<Recommendations>,
  ) {
    super(recommendationsReadRepository);
  }
}
