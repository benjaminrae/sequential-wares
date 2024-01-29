import { Entity, UniqueIdentifier } from '../shared';
import { InvalidRecommendationsError } from './errors/invalid-recommendations.error';
import { RecommendationsProps } from './types';

export class Recommendations extends Entity<RecommendationsProps> {
  public static create(props: RecommendationsProps): Recommendations {
    return new Recommendations({ id: new UniqueIdentifier(), props });
  }

  protected validate(props: RecommendationsProps): void {
    if (props.products.length === 0) {
      throw new InvalidRecommendationsError('Recommendations cannot be empty');
    }
  }
}
