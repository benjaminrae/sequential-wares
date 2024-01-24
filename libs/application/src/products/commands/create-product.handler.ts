import { DomainError, Product, Repository } from '@app/core';
import { CommandHandler } from '@app/core/shared/command';
import { Result } from '@app/core/shared/result';
import { CreateProductCommand } from './create-product.command';

export class CreateProductHandler implements CommandHandler<CreateProductCommand> {
  constructor(private readonly productRepository: Repository<Product>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_command: CreateProductCommand): Promise<Result<Product | Error>> {
    const product = Product.create({});

    try {
      await this.productRepository.create(product);

      return Result.ok(product);
    } catch (error) {
      return Result.failure(
        new DomainError({
          message: 'CreateProductHandler: Error creating product',
          details: {
            cause: (error as Error).message,
            origin: (error as Error).stack ?? 'CreateProductHandler',
            errors: [error],
          },
        }),
      );
    }
  }
}
