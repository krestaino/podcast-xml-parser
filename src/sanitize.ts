/**
 * Converts a time string in the format of HH:MM:SS or a numerical string to seconds.
 * If the provided time is neither in the correct format nor a numerical value, returns undefined.
 *
 * @param time - The time value to be converted to seconds. Accepts a string or any type.
 * @returns The converted time value in seconds or undefined if the provided time value is invalid.
 * @example
 *
 * convertToSeconds("12:34:56"); // Returns 45296
 * convertToSeconds("123456");   // Returns 123456
 * convertToSeconds("12:3456");  // Returns undefined
 */
export function getDuration(time: string | any): number | undefined {
  if (typeof time !== "string" && typeof time !== "number") {
    return undefined;
  }

  function isTimeFormat(value: any): boolean {
    const timeRegex = /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    return timeRegex.test(value);
  }

  if (typeof time === "string" && isTimeFormat(time)) {
    const [hours, minutes, seconds] = time.split(":").map((part) => parseInt(part));
    return hours * 3600 + minutes * 60 + seconds;
  } else if (typeof time === "number") {
    return time;
  } else if (Number.isFinite(Number(time))) {
    return parseInt(time);
  }

  return undefined;
}
