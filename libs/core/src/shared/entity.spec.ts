import { Entity } from './entity';
import { UniqueIdentifier } from './unique-identifier';

type TestEntityProps = {
  name: string;
};
class TestEntity extends Entity<TestEntityProps> {
  protected validate(): void {}
}

describe('Entity', () => {
  describe('toObject', () => {
    it('should return the entity as an object', () => {
      const entityName = 'test entity';
      const entityId = new UniqueIdentifier();
      const entity = new TestEntity({ id: entityId, props: { name: entityName } });

      expect(entity.toObject()).toEqual({
        id: entityId.toString(),
        createdAt: expect.any(Date),
        name: entityName,
      });
    });
  });

  describe('isEntity', () => {
    it.each([
      [new TestEntity({ id: new UniqueIdentifier(), props: { name: 'test' } }), true],
      [null, false],
      [{}, false],
    ])('should return true if the object is an entity', (entity, result) => {
      expect(TestEntity.isEntity(entity)).toEqual(result);
    });
  });

  describe('equals', () => {
    const firstEntityId = new UniqueIdentifier();
    const secondEntityId = new UniqueIdentifier();
    const first = new TestEntity({ id: firstEntityId, props: { name: 'first' } });
    const second = new TestEntity({ id: secondEntityId, props: { name: 'second' } });

    it.each([
      [first, first, true],
      [first, second, false],
      [first, null, false],
      [first, {}, false],
    ])(
      'should return true if the entities are equal (have the same id)',
      (first, second, result) => {
        expect(first.equals(second as TestEntity)).toEqual(result);
      },
    );
  });
});
