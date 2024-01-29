import { InvalidRecommendationsError } from './errors';
import { Recommendations } from './recommendations.entity';

describe('Recommendations', () => {
  describe('create', () => {
    it('should create a recommendations', () => {
      const recommendations = Recommendations.create({
        recommendedProducts: [['1']],
      });

      expect(recommendations).toBeInstanceOf(Recommendations);
      expect(recommendations.toObject().originalProducts).toEqual(['1']);
    });

    it('should throw an InvalidRecommendations error if the recommendations is empty', () => {
      const invalidRecommendations = { recommendedProducts: [] };

      expect(() => Recommendations.create(invalidRecommendations)).toThrow(
        InvalidRecommendationsError,
      );
    });
  });
});
