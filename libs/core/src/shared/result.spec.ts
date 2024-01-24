import { Result } from './result';

describe('Result', () => {
  it("should throw an error if it doesn't receive a value or an error", () => {
    expect(() => new Result({ value: undefined, error: undefined })).toThrow(
      'InvalidOperation: A result must have a value or an error',
    );
  });

  it('should throw an error if it receives a value and an error', () => {
    expect(() => new Result({ value: 'test', error: new Error('test') })).toThrow(
      'InvalidOperation: A result cannot have a value and an error',
    );
  });

  describe('ok', () => {
    it('should return a successful result with the received value', () => {
      const result = Result.ok('test');

      expect(result.isSuccess).toEqual(true);
      expect(result.isFailure).toEqual(false);
      expect(result.value).toEqual('test');
    });
  });

  describe('failure', () => {
    it('should return a failed result with the received error', () => {
      const result = Result.failure(new Error('test'));

      expect(result.isSuccess).toEqual(false);
      expect(result.isFailure).toEqual(true);
      expect(result.error).toEqual('test');
    });
  });

  describe('value', () => {
    it('should throw an error if the result is a failure', () => {
      const result = Result.failure(new Error('test'));

      expect(() => result.value).toThrow('Cannot retrieve value from failed result');
    });
  });
});
