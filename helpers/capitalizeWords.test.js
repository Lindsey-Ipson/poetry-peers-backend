const { capitalizeWords } = require('./capitalizeWords'); // Adjust the path as necessary

describe('capitalizeWords', () => {
  it('capitalizes the first letter of a single word', () => {
    expect(capitalizeWords('hello')).toBe('Hello');
  });

  it('capitalizes the first letter of each word in a phrase', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
  });

  it('handles mixed case input correctly', () => {
    expect(capitalizeWords('hElLo WoRlD')).toBe('Hello World');
  });

  it('does not change non-alphabetic characters', () => {
    expect(capitalizeWords('123 hello')).toBe('123 Hello');
  });

  it('handles an empty string correctly', () => {
    expect(capitalizeWords('')).toBe('');
  });

  it('handles a single letter correctly', () => {
    expect(capitalizeWords('a')).toBe('A');
  });

  it('handles multiple spaces between words correctly', () => {
    expect(capitalizeWords('hello    world')).toBe('Hello    World');
  });

  it('preserves whitespace at the start and end of the phrase', () => {
    expect(capitalizeWords('  hello world  ')).toBe('  Hello World  ');
  });

  it('capitalizes words with apostrophes correctly', () => {
    expect(capitalizeWords("it's a beautiful day")).toBe("It's A Beautiful Day");
  });

});
