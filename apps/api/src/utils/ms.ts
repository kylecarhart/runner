/**
 * Converts seconds to milliseconds
 * @param seconds - Number of seconds to convert
 * @returns Number of milliseconds
 * @example
 * seconds(2) // returns 2000
 */
export function seconds(seconds: number): number {
  return seconds * 1000;
}

/**
 * Converts minutes to milliseconds
 * @param minutes - Number of minutes to convert
 * @returns Number of milliseconds
 * @example
 * minutes(1) // returns 60000
 */
export function minutes(minutes: number): number {
  return minutes * 60000;
}

/**
 * Converts hours to milliseconds
 * @param hours - Number of hours to convert
 * @returns Number of milliseconds
 * @example
 * hours(1) // returns 3600000
 */
export function hours(hours: number): number {
  return hours * 3600000;
}

/**
 * Converts days to milliseconds
 * @param days - Number of days to convert
 * @returns Number of milliseconds
 * @example
 * days(1) // returns 86400000
 */
export function days(days: number): number {
  return days * 86400000;
}

/**
 * Converts weeks to milliseconds
 * @param weeks - Number of weeks to convert
 * @returns Number of milliseconds
 * @example
 * weeks(1) // returns 604800000
 */
export function weeks(weeks: number): number {
  return weeks * 604800000;
}
