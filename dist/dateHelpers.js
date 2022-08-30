"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTCDateString = exports.getDateOfStartOfWeek = exports.GenerateApproximateTime = exports.HoursToAMPM = exports.getTimeString = exports.AddEndingToDate = exports.ShortMonthLookup = exports.LongMonthLookup = exports.ShortDayLookup = exports.DayLookup = void 0;
exports.DayLookup = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
exports.ShortDayLookup = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
exports.LongMonthLookup = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
exports.ShortMonthLookup = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
function AddEndingToDate(day) {
    let lastDigit = day % 10;
    if (day > 10 && day < 14) {
        return day.toString() + "th";
    }
    if (lastDigit >= 4) {
        return day.toString() + "th";
    }
    switch (lastDigit) {
        case 1:
        case -1:
            return day.toString() + "st";
        case 2:
        case -2:
            return day.toString() + "nd";
        case 3:
        case -3:
            return day.toString() + "rd";
    }
    return day.toString() + "th";
}
exports.AddEndingToDate = AddEndingToDate;
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
function getTimeString(time, formatString) {
    let milHours = time.getHours();
    let minutes = time.getMinutes();
    let ampm = "am";
    let AMPM = "AM";
    let standHours = milHours;
    if (milHours >= 12) {
        ampm = "pm";
        AMPM = "PM";
    }
    if (milHours > 12) {
        standHours = milHours - 12;
    }
    formatString = formatString.replace(/hh/g, standHours.toString().padStart(2, "0"));
    formatString = formatString.replace(/HH/g, milHours.toString().padStart(2, "0"));
    formatString = formatString.replace(/H/g, milHours.toString());
    formatString = formatString.replace(/h/g, standHours.toString());
    formatString = formatString.replace(/mm/g, minutes.toString().padStart(2, "0"));
    formatString = formatString.replace(/ss/g, time.getSeconds.toString().padStart(2, "0"));
    formatString = formatString.replace(/nn/g, ampm);
    formatString = formatString.replace(/NN/g, AMPM);
    return formatString;
}
exports.getTimeString = getTimeString;
function HoursToAMPM(h) {
    if (h % 12 === 0) {
        return 12;
    }
    return h % 12;
}
exports.HoursToAMPM = HoursToAMPM;
/**
 * Generates string representation of approximate time or time span. e.g. this might turn May 27th at 12:04 UTC into something
 * like "in two minutes" or "two minutes ago" if UseTimespanPrefixes is true, it might instead return "for two minutes"
 * @param {Date} DateInput Time we wish to describe
 * @param {Date} Measuredfrom Usually current time.
 * @param {boolean} UseTimespanPrefixes If false, result will describe somethign like "in 1 hour". If true, will instead say "for one hour"
 * @param {boolean} shortNotation If true short forms like "mins" instead of "minutes" will be used.
 * @param maxAccuracy
 * @return {string}
 *
 */
function GenerateApproximateTime(DateInput, Measuredfrom = undefined, UseTimespanPrefixes = false, shortNotation = false, maxAccuracy = "seconds") {
    const CurTime = Measuredfrom || new Date(Date.now());
    let TimeUntil = DateInput.valueOf() - CurTime.valueOf();
    if (UseTimespanPrefixes && TimeUntil < 0) {
        TimeUntil = TimeUntil * -1;
    }
    const minutes = shortNotation ? "min" : "minutes";
    const seconds = shortNotation ? "s" : "seconds";
    const hours = shortNotation ? "hrs" : "hours";
    const days = shortNotation ? "d" : "days";
    const months = shortNotation ? "m" : "months";
    const years = shortNotation ? "yrs" : "years";
    const IN = UseTimespanPrefixes ? "for " : "in ";
    const until = UseTimespanPrefixes ? "until " : "";
    const Minutes = DateInput.getMinutes().toString().padStart(2, "0");
    if (TimeUntil > 0) {
        if (TimeUntil < 10000)
            //Less than 10 seconds
            return UseTimespanPrefixes ? "instantly" : "now";
        if (TimeUntil < 1000 * 60) {
            //Less than a minute
            return IN + Math.floor(TimeUntil / 1000) + " " + seconds;
        }
        if (TimeUntil < 1000 * 60 * 60) {
            //Less than an hour
            return IN + Math.floor(TimeUntil / (1000 * 60)) + " " + minutes; // (shortNotation ? "min" : " minutes");
        }
        if (TimeUntil < 1000 * 60 * 60 * 3) {
            //Less than 3 hours
            const Hours = Math.floor(TimeUntil / (1000 * 60 * 60));
            const Minutes = Math.floor((TimeUntil - Hours * 1000 * 60 * 60) / (1000 * 60));
            if (Minutes > 5) {
                return (IN +
                    Hours +
                    " " +
                    hours +
                    (shortNotation ? " " : " and ") +
                    Minutes +
                    " " +
                    minutes);
            }
            else {
                return IN + Hours + " " + hours;
            }
        }
        if (TimeUntil < 1000 * 60 * 60 * 24 && CurTime.getDay() === DateInput.getDay()) {
            if (maxAccuracy === "days") {
                return (until +
                    "today");
            }
            //Less than 1 day
            return (until +
                "today at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am"));
        }
        if (TimeUntil < 1000 * 60 * 60 * 48 && (CurTime.getDay() + 1) % 7 === DateInput.getDay()) {
            if (maxAccuracy === "days") {
                return (until +
                    "tomorrow");
            }
            //Tomorrow
            return (until +
                "tomorrow at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am"));
        }
        if (TimeUntil < 1000 * 60 * 60 * 24 * 6) {
            if (maxAccuracy === "days") {
                return (until +
                    exports.DayLookup[DateInput.getDay()]);
            }
            //Tomorrow
            return (until +
                exports.DayLookup[DateInput.getDay()] +
                " at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am"));
        }
        if (TimeUntil < 1000 * 60 * 60 * 24 * 100) {
            if (maxAccuracy === "days") {
                return (until +
                    exports.ShortMonthLookup[DateInput.getMonth()] +
                    " " +
                    DateInput.getDate());
            }
            //Tomorrow
            return (until +
                exports.ShortMonthLookup[DateInput.getMonth()] +
                " " +
                DateInput.getDate() +
                " at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am"));
        }
        return (until +
            exports.ShortMonthLookup[DateInput.getMonth()] +
            " " +
            DateInput.getDate() +
            " " +
            DateInput.getFullYear());
    }
    else {
        let timeAgo = -1 * TimeUntil;
        let ago = " ago";
        if (timeAgo < 10000)
            //Less than 10 seconds
            return UseTimespanPrefixes ? "instantly" : "now";
        if (timeAgo < 1000 * 60) {
            //Less than a minute
            return Math.floor(timeAgo / 1000) + " " + seconds + ago;
        }
        if (timeAgo < 1000 * 60 * 60) {
            //Less than an hour
            return Math.floor(timeAgo / (1000 * 60)) + " " + minutes + ago; // (shortNotation ? "min" : " minutes");
        }
        if (timeAgo < 1000 * 60 * 60 * 3) {
            //Less than 3 hours
            const Hours = Math.floor(timeAgo / (1000 * 60 * 60));
            const Minutes = Math.floor((timeAgo - Hours * 1000 * 60 * 60) / (1000 * 60));
            if (Minutes > 5) {
                return (Hours +
                    " " +
                    hours +
                    (shortNotation ? " " : " and ") +
                    Minutes +
                    " " +
                    minutes + ago);
            }
            else {
                return Hours + " " + hours + ago;
            }
        }
        if (timeAgo < 1000 * 60 * 60 * 24 && CurTime.getDay() === DateInput.getDay()) {
            if (maxAccuracy === "days") {
                return (until +
                    "today");
            }
            //Less than 1 day
            return (until +
                "today at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am"));
        }
        if (timeAgo < 1000 * 60 * 60 * 48 && (CurTime.getDay() + 1) % 7 === DateInput.getDay()) {
            if (maxAccuracy === "days") {
                return (until +
                    "yesterday");
            }
            //Tomorrow
            return (until +
                "yesterday at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am"));
        }
        if (timeAgo < 1000 * 60 * 60 * 24 * 6) {
            if (maxAccuracy === "days") {
                return (until +
                    exports.DayLookup[DateInput.getDay()]);
            }
            //Tomorrow
            return (until +
                exports.DayLookup[DateInput.getDay()] +
                " at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am"));
        }
        if (timeAgo < 1000 * 60 * 60 * 24 * 100) {
            if (maxAccuracy === "days") {
                return (until +
                    exports.ShortMonthLookup[DateInput.getMonth()] +
                    " " +
                    DateInput.getDate());
            }
            //Tomorrow
            return (until +
                exports.ShortMonthLookup[DateInput.getMonth()] +
                " " +
                DateInput.getDate() +
                " at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am"));
        }
        return (until +
            exports.ShortMonthLookup[DateInput.getMonth()] +
            " " +
            DateInput.getDate() +
            " " +
            DateInput.getFullYear());
    }
}
exports.GenerateApproximateTime = GenerateApproximateTime;
/**
 * Gets a date object representation of
 * @param date
 * @returns {Date}
 */
function getDateOfStartOfWeek(date) {
    const d = new Date(date.valueOf());
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 100);
    return d;
}
exports.getDateOfStartOfWeek = getDateOfStartOfWeek;
/**
 * @param date
 * @returns standardized utc date string as day-month-year. Do not modify. Used by backend to cache irrigation dates on schedule objects.
 */
function UTCDateString(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return `${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()}`;
}
exports.UTCDateString = UTCDateString;
//# sourceMappingURL=dateHelpers.js.map