import {
  RecommendationsModel,
  RecommendationsSchema,
} from '@app/infrastructure/persistence/recommendations/recommendations.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecommendationsModel.name, schema: RecommendationsSchema },
    ]),
  ],
})
export class RecommendationsModule {}
