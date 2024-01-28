import { DomainError, Entity, Repository } from '@app/core';
import { MongooseReadRepositoryAdapter } from './mongoose-read-repository.adapter';

export class MongooseRepositoryAdapter<DomainEntity extends Entity<unknown>, PersistedModel>
  extends MongooseReadRepositoryAdapter<DomainEntity, PersistedModel>
  implements Repository<DomainEntity>
{
  async create(entity: DomainEntity): Promise<DomainEntity> {
    try {
      const data = this.mapper.toPersistence(entity);
      const created = await this.schema.create(data);

      return await this.mapper.toDomain(created.toObject());
    } catch (error) {
      throw new DomainError({
        message: 'Error creating entity',
        details: {
          cause: error.message,
          origin: error.stack ?? this.constructor.name,
          errors: [error],
        },
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(entity: DomainEntity): Promise<DomainEntity> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(entity: DomainEntity): Promise<DomainEntity> {
    throw new Error('Method not implemented.');
  }
}
