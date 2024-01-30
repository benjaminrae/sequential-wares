import { Entity as BaseEntity } from './entity';
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

export type Direction = 'ASC' | 'DESC';

export type Order<Entity> = {
  field: keyof Entity;
  direction: Direction;
};

export type Pagination<Entity> = {
  limit: number;
  order: Direction;
  orderBy: keyof Entity;
  offset: number;
};

export class PaginatedQuery<Entity extends BaseEntity<unknown>> extends Query {
  #pagination: Pagination<Entity>;

  constructor(pagination: Pagination<Entity>) {
    super();

    this.#pagination = this.addDefaults(pagination);
  }

  public get pagination(): Pagination<Entity> {
    const pagination = structuredClone(this.#pagination);

    return pagination;
  }

  private addDefaults(pagination: Pagination<Entity>): Pagination<Entity> {
    return {
      limit: pagination.limit ?? 10,
      offset: pagination.offset ?? 0,
      order: pagination.order ?? 'DESC',
      orderBy: pagination.orderBy ?? 'createdAt',
    };
  }
}

export interface QueryHandler<TQuery extends Query> {
  execute(query: TQuery): Promise<Result<unknown>>;
}
