/**
 * Converts a time string in the format of HH:MM:SS or a numerical string to seconds.
 * If the provided time is neither in the correct format nor a numerical value, returns undefined.
 *
 * @param time - The time value to be converted to seconds. Accepts any input.
 * @returns The converted time value in seconds or undefined if the provided time value is invalid.
 * @example
 *
 * convertToSeconds("12:34:56"); // Returns 45296
 * convertToSeconds("123456");   // Returns 123456
 * convertToSeconds("12:3456");  // Returns undefined
 */
export declare function getDuration(time: unknown): number | undefined;
