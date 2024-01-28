import { PaginatedQuery, Query } from './query';
import { UniqueIdentifier } from './unique-identifier';

export type Paginated<Entity> = {
  data: Entity[];
  total: number;
};

export interface ReadRepository<Entity> {
  findById(id: UniqueIdentifier): Promise<Entity | null>;
  findMany(query?: PaginatedQuery<Entity>): Promise<Paginated<Entity>>;
  findOne(query: Query): Promise<Entity | null>;
}

export interface Repository<Entity> extends ReadRepository<Entity> {
  create(entity: Entity): Promise<Entity>;
  update(entity: Entity): Promise<Entity>;
  delete(entity: Entity): Promise<Entity>;
}
