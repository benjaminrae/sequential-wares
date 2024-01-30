import { Entity as BaseEntity } from './entity';
import { PaginatedQuery, Query } from './query';
import { UniqueIdentifier } from './unique-identifier';

export type Paginated<Entity extends BaseEntity<unknown>> = {
  data: Entity[];
  total: number;
  limit?: number;
  offset?: number;
};

export interface ReadRepository<Entity extends BaseEntity<unknown>> {
  findById(id: UniqueIdentifier): Promise<Entity | null>;
  findMany(query: PaginatedQuery<Entity>): Promise<Paginated<Entity>>;
  findOne(query: Query): Promise<Entity | null>;
}

export interface Repository<Entity extends BaseEntity<unknown>>
  extends ReadRepository<Entity> {
  create(entity: Entity): Promise<Entity>;
  update(entity: Entity): Promise<Entity>;
  delete(entity: Entity): Promise<Entity>;
}
