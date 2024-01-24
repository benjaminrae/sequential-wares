import { DomainError } from './domain-error';

describe('DomainError', () => {
  it('should have the name DomainError', () => {
    const error = new DomainError({ message: 'test' });

    expect(error.name).toEqual('DomainError');
  });

  describe('isDomainError', () => {
    it.each([
      [new DomainError({ message: 'test' }), true],
      [null, false],
      [{}, false],
    ])('should return true if the object is a domain error', (error, result) => {
      expect(DomainError.isDomainError(error)).toEqual(result);
    });
  });

  describe('fromError', () => {
    it('should return a domain error from an error', () => {
      const error = new Error('test');
      const domainError = DomainError.fromError(error);

      expect(domainError).toBeInstanceOf(DomainError);
      expect(domainError.message).toEqual(error.message);
      expect(domainError.details).toEqual({
        cause: error.name,
        origin: error.stack ?? '',
        errors: [error],
      });
    });
  });

  describe('combine', () => {
    it('should return a domain error from multiple errors', () => {
      const errors = [new Error('first'), new Error('second')];
      const domainError = DomainError.combine(errors, 'test');

      expect(domainError).toBeInstanceOf(DomainError);
      expect(domainError.message).toEqual('test');
      expect(domainError.details).toEqual({
        cause: 'Multiple errors',
        origin: errors.map((error) => error.stack).join('\n'),
        errors,
      });
    });
  });
});
