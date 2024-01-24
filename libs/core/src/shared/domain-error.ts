export type DomainErrorDetails = {
  cause: string;
  origin: string;
  errors: Error[];
};

export type DomainErrorProps = {
  message: string;
  details?: DomainErrorDetails;
};

export class DomainError extends Error {
  public details?: DomainErrorDetails;
  constructor({ message, details }: DomainErrorProps) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
  }

  public static isDomainError(error: unknown): error is DomainError {
    return error instanceof DomainError;
  }

  public static fromError(error: Error): DomainError {
    return new DomainError({
      message: error.message,
      details: {
        cause: error.name,
        origin: error.stack ?? '',
        errors: [error],
      },
    });
  }

  public static combine(errors: Error[], message: string): DomainError {
    return new DomainError({
      message: message,
      details: {
        cause: 'Multiple errors',
        origin: errors.map((error) => error.stack).join('\n'),
        errors,
      },
    });
  }
}
