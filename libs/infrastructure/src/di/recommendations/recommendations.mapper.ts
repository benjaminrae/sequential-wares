import { Mapper, Recommendations, UniqueIdentifier } from '@app/core';
import { RecommendationsResponse } from '@app/infrastructure/api/http/recommendations/recommendations.response';
import { RecommendationsModel } from '@app/infrastructure/persistence/recommendations/recommendations.schema';

export class RecommendationsMapper
  implements Mapper<Recommendations, RecommendationsModel>
{
  toDomain(data: RecommendationsModel): Recommendations {
    return new Recommendations({
      id: new UniqueIdentifier(data.id),
      createdAt: data.createdAt,
      props: {
        originalProducts: Recommendations.generateOriginalProducts(
          data.recommendedProducts,
        ),
        recommendedProducts: data.recommendedProducts,
      },
    });
  }
  toPersistence(domainEntity: Recommendations): RecommendationsModel {
    const entity = domainEntity.toObject();

    const model = new RecommendationsModel();
    model.id = entity.id;
    model.createdAt = entity.createdAt;
    model.recommendedProducts = entity.recommendedProducts;

    return model;
  }
  toPresenter(domainEntity: Recommendations): unknown {
    const entity = domainEntity.toObject();

    return new RecommendationsResponse({
      id: entity.id,
      created_at: entity.createdAt,
      recommended_products: entity.recommendedProducts,
      original_products: entity.originalProducts,
    });
  }
}
