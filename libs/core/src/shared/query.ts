import { Result } from './result';
import { UniqueIdentifier } from './unique-identifier';

export class Query {
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

export type Order<Entity> = {
  field: keyof Entity;
  direction: 'ASC' | 'DESC';
};

export type Pagination<Entity> = {
  limit?: number;
  order?: Order<Entity>;
  offset?: number;
};

export class PaginatedQuery<Entity> extends Query {
  #pagination: Pagination<Entity>;

  constructor(pagination: Pagination<Entity>) {
    super();

    this.#pagination = pagination;
  }

  public get pagination(): Pagination<Entity> {
    const pagination = structuredClone(this.#pagination);

    return pagination;
  }
}

export interface QueryHandler<TQuery extends Query> {
  execute(query: TQuery): Promise<Result<unknown>>;
}
