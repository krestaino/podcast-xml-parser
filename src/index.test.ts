import { greet } from '.';

test('greet function', () => {
  expect(greet('World')).toBe('Hello, World!');
});