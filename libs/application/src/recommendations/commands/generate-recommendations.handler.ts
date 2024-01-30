import { CommandHandler, DomainError, Repository, Result } from '@app/core';
import { Recommendations } from '@app/core/recommendations/recommendations.entity';
import { GenerateRecommendationsCommand } from './generate-recommendations.command';

export class GenerateRecommendationsHandler
  implements CommandHandler<GenerateRecommendationsCommand>
{
  constructor(
    private readonly recommendationsRepository: Repository<Recommendations>,
  ) {}

  async execute(
    command: GenerateRecommendationsCommand,
  ): Promise<Result<Recommendations | Error>> {
    const { products } = command;

    const uniqueProducts = Array.from(new Set(products));

    const recommendedProducts =
      this.generateRecommendedProducts(uniqueProducts);
    const orderedRecommendedProducts =
      this.orderRecommendedProducts(recommendedProducts);

    const recommendations = Recommendations.create({
      recommendedProducts: orderedRecommendedProducts,
    });

    try {
      await this.recommendationsRepository.create(recommendations);

      return Result.ok(recommendations);
    } catch (error) {
      return Result.failure(
        new DomainError({
          message:
            'GenerateRecommendationsHandler: Error generating recommendations',
          details: {
            cause: (error as Error).message,
            origin: (error as Error).stack ?? this.constructor.name,
            errors: [error],
          },
        }),
      );
    }
  }

  private generateRecommendedProducts(
    productIds: string[],
    index = 0,
    subsequence: string[] = [],
  ): string[][] {
    if (index === productIds.length) {
      if (subsequence.length !== 0) {
        return [subsequence];
      } else {
        return [];
      }
    }

    const withElement = this.generateRecommendedProducts(
      productIds,
      index + 1,
      [...subsequence, productIds[index]],
    );
    const withoutElement = this.generateRecommendedProducts(
      productIds,
      index + 1,
      subsequence,
    );

    return [...withElement, ...withoutElement];
  }

  private orderRecommendedProducts(
    recommendedProducts: string[][],
  ): string[][] {
    return recommendedProducts.sort((a, b) => {
      if (a.length === b.length) {
        return 0;
      }

      return a.length > b.length ? 1 : -1;
    });
  }
}
