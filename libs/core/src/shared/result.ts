import { DomainError } from './domain-error';

export type ResultError = DomainError | Error;

export type ResultProps<T> = {
  value?: T;
  error?: ResultError;
};

export class Result<ResultType> {
  public static ok<T>(value?: T): Result<T> {
    return new Result<T>({ value });
  }

  public static failure(error: ResultError): Result<ResultError> {
    return new Result({ error });
  }

  public isSuccess: boolean;
  public isFailure: boolean;
  public error?: ResultError;
  #value?: ResultType;

  constructor(props: ResultProps<ResultType>) {
    this.validate(props);

    this.isSuccess = props.error === undefined;
    this.isFailure = !this.isSuccess;
    this.error = props.error;
    this.#value = props.value;

    Object.freeze(this);
  }

  public get value(): ResultType {
    if (this.isFailure) {
      throw new DomainError({ message: 'Cannot retrieve value from failed result' });
    }

    return this.#value as ResultType;
  }

  protected validate(props: ResultProps<ResultType>): void {
    if (props.value !== undefined && props.error !== undefined) {
      throw new Error('InvalidOperation: A result cannot have a value and an error');
    }

    if (props.value === undefined && props.error === undefined) {
      throw new Error('InvalidOperation: A result must have a value or an error');
    }
  }
}
