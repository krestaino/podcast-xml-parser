/**
 * Converts a time string in the format of HH:MM:SS, MM:SS, or a numerical string to seconds.
 * If the provided time is neither in the correct format nor a numerical value, returns 0.
 *
 * @param time - The time value to be converted to seconds. Accepts any input.
 * @returns The converted time value in seconds or 0 if the provided time value is invalid.
 * @example
 *
 * getDuration("12:34:56"); // Returns 45296
 * getDuration("1:23");     // Returns 83
 * getDuration("1:20:50");  // Returns 4850
 * getDuration("123456");   // Returns 123456
 * getDuration("12:3456");  // Returns 0
 * getDuration("");         // Returns 0
 */
export declare function getDuration(time: unknown): number;
