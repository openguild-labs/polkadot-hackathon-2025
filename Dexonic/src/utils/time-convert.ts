// import { format, fromZonedTime, toZonedTime } from 'date-fns-tz';
// export function convertToLocalTime(timeString: string) {
//     const utcDate = fromZonedTime(timeString, 'Asia/Bangkok'); // UTC+7
//     const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//     const localDate = toZonedTime(utcDate, localTimeZone);
//     return format(localDate, 'yyyy-MM-dd HH:mm:ss');
// }

import { format, toZonedTime } from 'date-fns-tz';

export function convertToLocalTime(timestamp: number) {
    try {
        const dateInMilliseconds = timestamp * 1000;
        const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localDate = toZonedTime(dateInMilliseconds, localTimeZone);
        return format(localDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: localTimeZone });
    } catch (error) {
        console.error('Error in convertToLocalTime:', timestamp, error);
        return 'Invalid date';
    }
}
