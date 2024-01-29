import { DomainError } from '@app/core/shared';

export class InvalidRecommendationsError extends DomainError {
  constructor(message: string) {
    super({ message: `Invalid Recommendations: ${message}` });
  }
}
