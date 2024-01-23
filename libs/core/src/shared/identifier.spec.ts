import { Identifier } from '@app/core/shared';

describe('Identifier', () => {
  describe('getValue', () => {
    it.each([['1'], [1]])('should return the received value', (value: unknown) => {
      const id = new Identifier(value);

      expect(id.getValue()).toBe(value);
    });
  });

  describe('toString', () => {
    it.each([[1]])('should convert the received value', (value: unknown) => {
      const id = new Identifier(value);

      expect(id.toString()).toBe(String(value));
    });
  });

  describe('equals', () => {
    it.each([
      [1, 1, true],
      [1, 2, false],
      ['1', '1', true],
      ['1', '2', false],
    ])(
      'should compare the received value',
      (value1: unknown, value2: unknown, expected: boolean) => {
        const id1 = new Identifier(value1);
        const id2 = new Identifier(value2);

        expect(id1.equals(id2)).toBe(expected);
      },
    );
  });

  describe('isIdentifier', () => {
    it.each([
      [1, false],
      ['1', false],
      [new Identifier(1), true],
      [new Identifier('1'), true],
      [null, false],
      [undefined, false],
    ])(
      'should check if the received value is an Identifier',
      (value: unknown, expected: boolean) => {
        expect(Identifier.isIdentifier(value)).toBe(expected);
      },
    );
  });
});
