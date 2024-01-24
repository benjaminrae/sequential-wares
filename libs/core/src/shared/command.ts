import { Result } from './result';
import { UniqueIdentifier } from './unique-identifier';

export interface CommandHandler<TCommand extends Command> {
  execute(command: TCommand): Promise<Result<unknown>>;
}

export class Command {
  #id: UniqueIdentifier;
  #timestamp: number;

  constructor() {
    this.#id = new UniqueIdentifier();
    this.#timestamp = Date.now();
  }

  public get id(): string {
    return this.#id.toString();
  }

  public get timestamp(): number {
    return this.#timestamp;
  }
}
