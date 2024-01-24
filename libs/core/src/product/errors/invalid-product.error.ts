import { DomainError } from '@app/core/shared';

export class InvalidProductError extends DomainError {
  constructor(message: string) {
    super({ message: `Invalid Product: ${message}` });
  }
}
