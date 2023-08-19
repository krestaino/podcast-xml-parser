import { getDuration } from "../src/sanitize";

describe('getDuration function', () => {
  it('converts time string in HH:MM:SS format to seconds', () => {
    expect(getDuration('12:34:56')).toBe(45296);
  });

  it('converts numerical string to seconds', () => {
    expect(getDuration('123456')).toBe(123456);
  });

  it('returns undefined for invalid time format', () => {
    expect(getDuration('12:3456')).toBeUndefined();
  });

  it('returns undefined for non-string, non-numerical inputs', () => {
    expect(getDuration(null)).toBeUndefined();
    expect(getDuration({})).toBeUndefined();
    expect(getDuration(undefined)).toBeUndefined();
    expect(getDuration(true)).toBeUndefined();
  });

  it('converts time string without leading zeros to seconds', () => {
    expect(getDuration('1:2:3')).toBe(3723);
  });

  it('converts numerical input to seconds', () => {
    expect(getDuration(123456)).toBe(123456);
  });
});