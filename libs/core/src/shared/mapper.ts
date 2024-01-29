import { Entity } from './entity';

export interface Mapper<DomainEntity extends Entity<unknown>, PersistedModel, Response = unknown> {
  toDomain(data: PersistedModel): DomainEntity;
  toPersistence(domainEntity: DomainEntity): PersistedModel;
  toPresenter(domainEntity: DomainEntity): Response;
}
