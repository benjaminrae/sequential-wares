import { Entity, UniqueIdentifier } from '../shared';
import { InvalidRecommendationsError } from './errors/invalid-recommendations.error';
import { CreateRecommendationsProps, RecommendationsProps } from './types';

export class Recommendations extends Entity<RecommendationsProps> {
  public static create(props: CreateRecommendationsProps): Recommendations {
    return new Recommendations({
      id: new UniqueIdentifier(),
      props: {
        ...props,
        originalProducts: Recommendations.generateOriginalProducts(
          props.recommendedProducts,
        ),
      },
    });
  }

  protected validate(props: RecommendationsProps): void {
    if (props.recommendedProducts.length === 0) {
      throw new InvalidRecommendationsError('Recommendations cannot be empty');
    }
  }

  public static generateOriginalProducts(
    recommendedProducts: string[][],
  ): string[] {
    const originalProducts = new Set<string>(recommendedProducts.flat());

    return [...originalProducts];
  }
}
