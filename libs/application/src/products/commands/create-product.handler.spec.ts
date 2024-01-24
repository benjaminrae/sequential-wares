import { Product } from '@app/core';
import { FakeRepository } from '@app/core/shared/fake-repository';
import { CreateProductCommand } from './create-product.command';
import { CreateProductHandler } from './create-product.handler';

describe('CreateProductHandler', () => {
  let repository = new FakeRepository<Product>();

  beforeEach(() => {
    repository = new FakeRepository<Product>();
    jest.clearAllMocks();
  });

  it('should create a product and return a succesful result', async () => {
    const command = new CreateProductCommand();
    const handler = new CreateProductHandler(repository);
    repository.create = jest.fn().mockResolvedValue(undefined);

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(true);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('should return a failure result if the product cannot be created', async () => {
    const command = new CreateProductCommand();
    const handler = new CreateProductHandler(repository);
    repository.create = jest.fn().mockRejectedValue(new Error('test'));

    const result = await handler.execute(command);

    expect(result.isFailure).toBe(true);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });
});
