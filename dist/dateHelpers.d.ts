export declare const DayLookup: string[];
export declare const ShortDayLookup: string[];
export declare const LongMonthLookup: string[];
export declare const ShortMonthLookup: string[];
export declare function AddEndingToDate(day: any): string;
/**
 * 2:30 pm in different format strings:
 * hh:mm nn -> 02:30 pm
 * HH:mm NN -> 14:30 PM
 * h:mm nn -> 2:30 pm
 * ss is seconds
 * @param {Date} time
 * @param formatString
 * @return {string}
 */
export declare function getTimeString(time: Date, formatString: string): string;
/**
 * Generates string representation of approximate time or time span. e.g. this might turn May 27th at 12:04 UTC into something
 * like "in two minutes" or "two minutes ago" if UseTimespanPrefixes is true, it might instead return "for two minutes"
 * @param {Date} DateInput Time we wish to describe
 * @param {Date} Measuredfrom Usually current time.
 * @param {boolean} UseTimespanPrefixes If false, result will describe somethign like "in 1 hour". If true, will instead say "for one hour"
 * @param {boolean} shortNotation If true short forms like "mins" instead of "minutes" will be used.
 * @return {string}
 *
 */
export declare function GenerateApproximateTime(DateInput: any, Measuredfrom?: any, UseTimespanPrefixes?: boolean, shortNotation?: boolean): string;
/**
 * Gets a date object representation of
 * @param date
 * @returns {Date}
 */
export declare function getDateOfStartOfWeek(date: Date): Date;
/**
 * @param date
 * @returns standardized utc date string as day-month-year. Do not modify. Used by backend to cache irrigation dates on schedule objects.
 */
export declare function UTCDateString(date: number | Date): string;
