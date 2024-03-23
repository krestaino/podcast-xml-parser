import { getDuration } from "../sanitize";

describe("getDuration function", () => {
  it("converts time string in HH:MM:SS format to seconds", () => {
    expect(getDuration("12:34:56")).toBe(45296);
  });

  it("converts time string in MM:SS format to seconds", () => {
    expect(getDuration("34:56")).toBe(2096);
  });

  it("converts numerical string to seconds", () => {
    expect(getDuration("123456")).toBe(123456);
  });

  it("returns 0 for invalid time format", () => {
    expect(getDuration("12:3456")).toBe(0);
  });

  it("returns 0 for non-string, non-numerical inputs", () => {
    expect(getDuration(null)).toBe(0);
    expect(getDuration({})).toBe(0);
    expect(getDuration(undefined)).toBe(0);
    expect(getDuration(true)).toBe(0);
  });

  it("converts time string without leading zeros to seconds", () => {
    expect(getDuration("1:2:3")).toBe(3723);
  });

  it("converts numerical input to seconds", () => {
    expect(getDuration(123456)).toBe(123456);
  });

  it("returns 0 for empty time string", () => {
    expect(getDuration("")).toBe(0);
  });
});
