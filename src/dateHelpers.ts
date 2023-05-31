export const DayLookup = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
export const ShortDayLookup = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
export const LongMonthLookup = [
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
export const ShortMonthLookup = [
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



export function AddEndingToDate(day): string {
    let lastDigit = day % 10;
    if(day > 10 && day < 14){
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

/**
 * 2:30 pm in different format strings:
 * hh:mm nn -> 02:30 pm
 * HH:mm NN -> 14:30 PM
 * h:mm nn -> 2:30 pm
 * mmm is milliseconds
 * ss is seconds
 * M is numeric month (e.g. 2)
 * MM is padded numeric month (e.g. 02)
 * MMM is short month (e.g. Feb)
 * MMMM is long month (e.g. February)
 * d is day
 * dd is padded day
 * @param {Date} time
 * @param formatString
 * @return {string}
 */
export function getTimeString(time: Date, formatString: string, utc=false): string {
    let milHours = time.getHours();
    let minutes = time.getMinutes();
    let date = time.getDate();
    let month = time.getMonth();
    let year = time.getFullYear();
    if(utc){
        milHours = time.getUTCHours();
        minutes = time.getUTCMinutes();
        date = time.getUTCDate();
        month = time.getUTCMonth();
        year = time.getUTCFullYear();
    }
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

    formatString = formatString.replace(/mmm/g, time.getMilliseconds().toString().padStart(3, "0"));
    formatString = formatString.replace(/mm/g, minutes.toString().padStart(2, "0"));
    formatString = formatString.replace(/ss/g, time.getSeconds().toString().padStart(2, "0"));
    formatString = formatString.replace(/nn/g, ampm);
    formatString = formatString.replace(/NN/g, AMPM);

    formatString = formatString.replace(/dd/g, date.toString().padStart(2, "0"));
    formatString = formatString.replace(/d/g, date.toString());

    //move these to lower case so they don't conflict with anything else
    formatString = formatString.replace(/MMMM/g, "mmmm");
    formatString = formatString.replace(/MMM/g, "mmm");
    formatString = formatString.replace(/MM/g, (month + 1).toString().padStart(2, "0"));
    formatString = formatString.replace(/M/g, (month + 1).toString());

    formatString = formatString.replace(/mmmm/g, LongMonthLookup[month]);
    formatString = formatString.replace(/mmm/g, ShortMonthLookup[month]);


    formatString = formatString.replace(/yyyy/g, year.toString());
    formatString = formatString.replace(/yy/g, year.toString().substring(2, 4));
    return formatString;
}

export function HoursToAMPM(h){
    if(h % 12 === 0){
        return 12;
    }
    return h % 12;
}

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
export function GenerateApproximateTime(
    DateInput,
    Measuredfrom = undefined,
    UseTimespanPrefixes = false,
    shortNotation = false,
    maxAccuracy : "seconds" | "days" = "seconds",
) {
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
                return (
                    IN +
                    Hours +
                    " " +
                    hours +
                    (shortNotation ? " " : " and ") +
                    Minutes +
                    " " +
                    minutes
                );
            } else {
                return IN + Hours + " " + hours;
            }
        }
        if (TimeUntil < 1000 * 60 * 60 * 24 && CurTime.getDay() === DateInput.getDay()) {
            if(maxAccuracy === "days"){
                return (
                    until +
                    "today"
                );
            }
            //Less than 1 day
            return (
                until +
                "today at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am")
            );
        }
        if (TimeUntil < 1000 * 60 * 60 * 48 && (CurTime.getDay() + 1) % 7 === DateInput.getDay()) {
            if(maxAccuracy === "days"){
                return (
                    until +
                    "tomorrow"
                );
            }
            //Tomorrow
            return (
                until +
                "tomorrow at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am")
            );
        }
        if (TimeUntil < 1000 * 60 * 60 * 24 * 6) {
            if(maxAccuracy === "days"){
                return (
                    until +
                    DayLookup[DateInput.getDay()]
                );
            }
            //Tomorrow
            return (
                until +
                DayLookup[DateInput.getDay()] +
                " at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am")
            );
        }
        if (TimeUntil < 1000 * 60 * 60 * 24 * 100) {
            if(maxAccuracy === "days"){
                return (
                    until +
                    ShortMonthLookup[DateInput.getMonth()] +
                    " " +
                    DateInput.getDate()
                );
            }
            //Tomorrow
            return (
                until +
                ShortMonthLookup[DateInput.getMonth()] +
                " " +
                DateInput.getDate() +
                " at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am")
            );
        }
        return (
            until +
            ShortMonthLookup[DateInput.getMonth()] +
            " " +
            DateInput.getDate() +
            " " +
            DateInput.getFullYear()
        );
    } else {
        let timeAgo = -1 * TimeUntil;
        let ago = " ago";
        if ( timeAgo < 10000)
            //Less than 10 seconds
            return UseTimespanPrefixes ? "instantly" : "now";
        if ( timeAgo < 1000 * 60) {
            //Less than a minute
            return Math.floor(timeAgo / 1000) + " " + seconds + ago;
        }
        if ( timeAgo < 1000 * 60 * 60) {
            //Less than an hour
            return  Math.floor(timeAgo / (1000 * 60)) + " " + minutes + ago;  // (shortNotation ? "min" : " minutes");
        }
        if (timeAgo < 1000 * 60 * 60 * 3) {
            //Less than 3 hours
            const Hours = Math.floor(timeAgo / (1000 * 60 * 60));
            const Minutes = Math.floor((timeAgo - Hours * 1000 * 60 * 60) / (1000 * 60));
            if (Minutes > 5) {
                return (
                    Hours +
                    " " +
                    hours +
                    (shortNotation ? " " : " and ") +
                    Minutes +
                    " " +
                    minutes  + ago
                );
            } else {
                return Hours + " " + hours  + ago;
            }
        }
        if (timeAgo < 1000 * 60 * 60 * 24 && CurTime.getDay() === DateInput.getDay()) {
            if(maxAccuracy === "days"){
                return (
                    until +
                    "today"
                );
            }
            //Less than 1 day
            return (
                until +
                "today at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am")
            );
        }
        if (timeAgo < 1000 * 60 * 60 * 48 && (CurTime.getDay() + 1) % 7 === DateInput.getDay()) {
            if(maxAccuracy === "days"){
                return (
                    until +
                    "yesterday"
                );
            }
            //Tomorrow
            return (
                until +
                "yesterday at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am")
            );
        }
        if (timeAgo < 1000 * 60 * 60 * 24 * 6) {
            if(maxAccuracy === "days"){
                return (
                    until +
                    DayLookup[DateInput.getDay()]
                );
            }
            //Tomorrow
            return (
                until +
                DayLookup[DateInput.getDay()] +
                " at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am")
            );
        }
        if (timeAgo < 1000 * 60 * 60 * 24 * 100) {
            if(maxAccuracy === "days"){
                return (
                    until +
                    ShortMonthLookup[DateInput.getMonth()] +
                    " " +
                    DateInput.getDate()
                );
            }
            //Tomorrow
            return (
                until +
                ShortMonthLookup[DateInput.getMonth()] +
                " " +
                DateInput.getDate() +
                " at " +
                HoursToAMPM(DateInput.getHours()) +
                ":" +
                Minutes +
                (DateInput.getHours() >= 12 ? "pm" : "am")
            );
        }
        return (
            until +
            ShortMonthLookup[DateInput.getMonth()] +
            " " +
            DateInput.getDate() +
            " " +
            DateInput.getFullYear()
        );
    }
}


/**
 * Gets a date object representation of
 * @param date
 * @returns {Date}
 */
export function getDateOfStartOfWeek(date: Date): Date {
    const d = new Date(date.valueOf());
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 100);
    return d;
}

/**
 * @param date
 * @returns standardized utc date string as day-month-year. Do not modify. Used by backend to cache irrigation dates on schedule objects.
 */
export function UTCDateString(date: number | Date): string {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return `${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()}`;
}
