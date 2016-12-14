/** @flow */

jest.useFakeTimers();

let hello;

beforeAll(() => {
  hello = 0;
});

it('is great', () => {
  expect(hello + 1).toBe(1);
});
