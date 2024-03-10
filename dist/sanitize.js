"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDuration = void 0;
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
 */
function getDuration(time) {
    var _a;
    if (typeof time !== "string" && typeof time !== "number") {
        return 0;
    }
    if (typeof time === "string") {
        // Check if the time string is in the format of HH:MM:SS or MM:SS
        var timeRegex = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{1,2})$/;
        var match = time.match(timeRegex);
        if (match != null) {
            var hours = parseInt((_a = match[1]) !== null && _a !== void 0 ? _a : "0", 10);
            var minutes = parseInt(match[2], 10);
            var seconds = parseInt(match[3], 10);
            return hours * 3600 + minutes * 60 + seconds;
        }
        else if (!isNaN(Number(time))) {
            // If the time string is a numerical value, parse it as an integer
            return parseInt(time, 10);
        }
    }
    else if (typeof time === "number") {
        // If the time is already a number, return it
        return time;
    }
    // If the time is in an invalid format, return 0
    return 0;
}
exports.getDuration = getDuration;
