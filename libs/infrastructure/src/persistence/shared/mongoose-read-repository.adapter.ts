import {
  DomainError,
  Entity,
  Paginated,
  ReadRepository,
  UniqueIdentifier,
} from '@app/core';
import { Mapper } from '@app/core/shared/mapper';
import { Order, PaginatedQuery, Query } from '@app/core/shared/query';
import { Model, SortOrder } from 'mongoose';

export class MongooseReadRepositoryAdapter<
  DomainEntity extends Entity<unknown>,
  PersistedModel,
> implements ReadRepository<DomainEntity>
{
  constructor(
    public schema: Model<PersistedModel>,
    public mapper: Mapper<DomainEntity, PersistedModel>,
  ) {}

  async findById(id: UniqueIdentifier): Promise<DomainEntity | null> {
    try {
      const data = await this.schema.findOne({ id }).exec();

      if (!data) {
        return null;
      }

      return this.mapper.toDomain(data?.toObject());
    } catch {
      throw new Error('Error finding entity');
    }
  }
  async findMany(
    query: PaginatedQuery<DomainEntity>,
  ): Promise<Paginated<DomainEntity>> {
    const pagination = query.pagination;

    const order: Order<DomainEntity> = {
      field: pagination.orderBy,
      direction: pagination.order,
    };

    try {
      const dataQuery = this.schema
        .find()
        .limit(pagination.limit)
        .skip(pagination.offset)
        .sort(this.transformOrder(order));

      const data = await dataQuery.exec();
      const total = await this.schema.countDocuments().exec();

      const entities = data.map((item) =>
        this.mapper.toDomain(item.toObject()),
      );

      return {
        total,
        data: entities,
        limit: pagination?.limit,
        offset: pagination?.offset,
      };
    } catch (error) {
      throw new DomainError({
        message: 'Error finding entities',
        details: {
          cause: error.message,
          origin: error.stack ?? this.constructor.name,
          errors: [error],
        },
      });
    }
  }

  async findOne(query: Query): Promise<DomainEntity | null> {
    try {
      const data = await this.schema.findOne(query).exec();

      if (!data) {
        return null;
      }

      return this.mapper.toDomain(data?.toObject());
    } catch {
      throw new Error('Error finding entity');
    }
  }

  private transformOrder(
    order?: Order<DomainEntity>,
  ): Record<string, SortOrder> {
    if (!order || !order.field) {
      return {};
    }

    const direction: SortOrder = order.direction === 'ASC' ? 'asc' : 'desc';

    return {
      [order.field]: direction,
    };
  }
}
