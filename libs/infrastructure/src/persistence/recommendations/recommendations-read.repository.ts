import { Mapper, Recommendations } from '@app/core';
import { RecommendationsKeys } from '@app/infrastructure/di/recommendations/recommendations.keys';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseReadRepositoryAdapter } from '../shared/mongoose-read-repository.adapter';
import { RecommendationsModel } from './recommendations.schema';

@Injectable()
export class RecommendationsReadRepository extends MongooseReadRepositoryAdapter<
  Recommendations,
  RecommendationsModel
> {
  constructor(
    @InjectModel(RecommendationsModel.name)
    recommendationsModel: Model<RecommendationsModel>,
    @Inject(RecommendationsKeys.RECOMMENDATIONS_MAPPER)
    recommendationsMapper: Mapper<Recommendations, RecommendationsModel>,
  ) {
    super(recommendationsModel, recommendationsMapper);
  }
}
