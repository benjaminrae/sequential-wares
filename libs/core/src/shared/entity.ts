import { UniqueIdentifier } from './unique-identifier';

export type BaseEntityProps = {
  id: string;
  createdAt: Date;
};

export type CreateEntityProps<T> = {
  id: UniqueIdentifier;
  props: T;
  createdAt?: Date;
};

export abstract class Entity<EntityProps> {
  #id: UniqueIdentifier;
  #createdAt: Date;
  protected props: EntityProps;

  constructor({ id, createdAt, props }: CreateEntityProps<EntityProps>) {
    this.validate(props);

    this.#id = id;
    this.#createdAt = createdAt ?? new Date();
    this.props = props;
  }

  public get id(): UniqueIdentifier {
    return this.#id;
  }

  public get createdAt(): Date {
    return this.#createdAt;
  }

  public toObject(): EntityProps & BaseEntityProps {
    const props = structuredClone(this.props);

    return {
      id: this.id.toString(),
      createdAt: this.createdAt,
      ...props,
    };
  }

  public equals(entity?: Entity<EntityProps>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (!Entity.isEntity(entity)) {
      return false;
    }

    return this.id.equals(entity.id);
  }

  public static isEntity(entity: unknown): entity is Entity<unknown> {
    return entity instanceof Entity;
  }

  protected abstract validate(props: EntityProps): void;
}
