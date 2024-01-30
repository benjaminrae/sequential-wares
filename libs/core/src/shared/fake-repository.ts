import { Entity as BaseEntity } from './entity';
import { PaginatedQuery, Query } from './query';
import { Paginated, Repository } from './repository';
import { UniqueIdentifier } from './unique-identifier';

/* eslint-disable @typescript-eslint/no-unused-vars */
export class FakeRepository<Entity extends BaseEntity<unknown>>
  implements Repository<Entity>
{
  #entities: Entity[] = [];
  async create(entity: Entity): Promise<Entity> {
    this.#entities.push(entity);
    return entity;
  }
  async update(entity: Entity): Promise<Entity> {
    throw new Error('Method not implemented.');
  }
  delete(entity: Entity): Promise<Entity> {
    throw new Error('Method not implemented.');
  }
  findById(id: UniqueIdentifier): Promise<Entity> {
    throw new Error('Method not implemented.');
  }
  findMany(
    query?: PaginatedQuery<Entity> | undefined,
  ): Promise<Paginated<Entity>> {
    throw new Error('Method not implemented.');
  }
  findOne(query: Query): Promise<Entity> {
    throw new Error('Method not implemented.');
  }
}
