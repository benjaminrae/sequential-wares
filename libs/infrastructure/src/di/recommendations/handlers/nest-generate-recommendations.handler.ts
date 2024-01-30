import {
  GenerateRecommendationsCommand,
  GenerateRecommendationsHandler,
} from '@app/application/recommendations';
import { Recommendations, Repository } from '@app/core';
import { Inject } from '@nestjs/common';
import { CommandHandler as NestCommandHandler } from '@nestjs/cqrs';
import { RecommendationsKeys } from '../recommendations.keys';

@NestCommandHandler(GenerateRecommendationsCommand)
export class NestGenerateRecommendationsHandler extends GenerateRecommendationsHandler {
  constructor(
    @Inject(RecommendationsKeys.RECOMMENDATIONS_REPOSITORY)
    recommendationsRepository: Repository<Recommendations>,
  ) {
    super(recommendationsRepository);
  }
}
