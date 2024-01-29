import { InvalidRecommendationsError } from './errors';
import { Recommendations } from './recommendations.entity';

describe('Recommendations', () => {
  describe('create', () => {
    it('should create a recommendations', () => {
      const recommendations = Recommendations.create({ products: [['1']] });

      expect(recommendations).toBeInstanceOf(Recommendations);
    });

    it('should throw an InvalidRecommendations error if the recommendations is empty', () => {
      const invalidRecommendations = { products: [] };

      expect(() => Recommendations.create(invalidRecommendations)).toThrow(
        InvalidRecommendationsError,
      );
    });
  });
});
