import { Command } from '@app/core';

export type GenerateRecommendationsCommandProps = {
  products: string[];
};

export class GenerateRecommendationsCommand extends Command {
  readonly products: string[];

  constructor({ products }: GenerateRecommendationsCommandProps) {
    super();
    this.products = products;
  }
}
