import { UniqueIdentifier } from './unique-identifier';

describe('UniqueIdentifier', () => {
  describe('getValue', () => {
    it('should return a UUID if no value is received', () => {
      const id = new UniqueIdentifier();

      expect(id.getValue()).toMatch(/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/);
    });
  });
});
