import { ExceptionBase } from './exception.base';

class TestException extends ExceptionBase {
  code = 'TEST_ERROR';
}

describe('ExceptionBase', () => {
  it('should extend Error', () => {
    const error = new TestException('Test message');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ExceptionBase);
  });

  it('should set message correctly', () => {
    const error = new TestException('Test message');

    expect(error.message).toBe('Test message');
  });

  it('should set cause when provided', () => {
    const cause = new Error('Root cause');
    const error = new TestException('Test message', cause);

    expect(error.cause).toBe(cause);
  });

    it('should capture stack trace', () => {
    const error = new TestException('Test message');

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
    expect(error.stack).toContain('Test message');
    });

  it('should serialize correctly using toJson()', () => {
    const cause = new Error('Root cause');
    const error = new TestException('Test message', cause);

    const json = error.toJson();

    expect(json).toEqual({
      message: 'Test message',
      code: 'TEST_ERROR',
      stack: error.stack,
      cause: JSON.stringify(cause),
    });
  });

  it('should serialize cause as undefined when not provided', () => {
    const error = new TestException('Test message');

    const json = error.toJson();

    expect(json.cause).toBeUndefined();
  });
});
