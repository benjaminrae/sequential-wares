import { GenerateRecommendationsController } from '@app/infrastructure/api/http/recommendations/commands/generate-recommendations.controller';
import { GetRecommendationsController } from '@app/infrastructure/api/http/recommendations/queries/get-recommendations.controller';
import { RecommendationsReadRepository } from '@app/infrastructure/persistence/recommendations/recommendations-read.repository';
import { RecommendationsRepository } from '@app/infrastructure/persistence/recommendations/recommendations.repository';
import {
  RecommendationsModel,
  RecommendationsSchema,
} from '@app/infrastructure/persistence/recommendations/recommendations.schema';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { NestGenerateRecommendationsHandler } from './handlers/nest-generate-recommendations.handler';
import { NestGetRecommendationsHandler } from './handlers/nest-get-recommendations.handler';
import { RecommendationsKeys } from './recommendations.keys';
import { RecommendationsMapper } from './recommendations.mapper';

const repositories: Provider[] = [
  {
    provide: RecommendationsKeys.RECOMMENDATIONS_REPOSITORY,
    useClass: RecommendationsRepository,
  },
  {
    provide: RecommendationsKeys.RECOMMENDATIONS_READ_REPOSITORY,
    useClass: RecommendationsReadRepository,
  },
];

export const mappers: Provider[] = [
  {
    provide: RecommendationsKeys.RECOMMENDATIONS_MAPPER,
    useFactory: () => {
      return new RecommendationsMapper();
    },
  },
];

export const models: Provider[] = [
  {
    provide: RecommendationsKeys.RECOMMENDATIONS_MODEL,
    useValue: RecommendationsModel,
  },
];

export const handlers: Provider[] = [
  NestGenerateRecommendationsHandler,
  NestGetRecommendationsHandler,
];

export const controllers = [
  GenerateRecommendationsController,
  GetRecommendationsController,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecommendationsModel.name, schema: RecommendationsSchema },
    ]),
    CqrsModule,
    AuthModule,
  ],
  controllers: [...controllers],
  providers: [...models, ...repositories, ...mappers, ...handlers],
})
export class RecommendationsModule {}
