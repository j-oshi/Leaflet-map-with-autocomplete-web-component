const days = [
    'SUN',
    'MON',
    'TUES',
    'WED',
    'THURS',
    'FRI',
    'SAT',
    'SUN',
];

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const daysInAMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
};

const getDaysInAMonth = (months, year, func) => {{
    return months.map((index, month) => {
        let obj = {};
        obj[index] = func(month + 1, year);
        return obj;
    });
}}

console.log(getDaysInAMonth(months, 2024, daysInAMonth))

const convertDateToUnixTimestamp = (year, month, date) => {
    return `${year}/${month + 1}/${date} 23:59:59`;
};

export const timeFilter = (previousOffset, nextOffset) => {
    let currentTime = null, currentDate = null, currentMonth = null, currentYear = null;
    currentTime = new Date();
    currentDate = currentTime.getDate();
    currentMonth = currentTime.getMonth();
    currentYear = currentTime.getFullYear();
    const adjustTimeMonth = (monthOffset) => {
        return new Date(
            currentYear,
            currentMonth + monthOffset,
            currentDate > 28 ? currentDate - 3 : currentDate
        );
    };





    const monthOffStart = Number.isInteger(previousOffset) ? previousOffset : 0;
    const monthOffEnd = Number.isInteger(nextOffset) ? nextOffset : 1;

    const range = (start = monthOffStart, end = monthOffEnd) => {
        const timeArray = [];
        for (let i = start; i <= end; i++) {
            timeArray.push(i);
        }
        return timeArray;
    };
    const monthOffset = range();

    const monthInRange = monthOffset
        .map((month) => {
            const monthValue = adjustTimeMonth(month).getMonth();
            const yearValue = adjustTimeMonth(month).getFullYear();
            return {
                month: months[monthValue],
                year: yearValue,
                numberOfday: daysInAMonth(monthValue + 1, yearValue),
                startDate: convertDateToUnixTimestamp(yearValue, monthValue, 1),
                endDate: convertDateToUnixTimestamp(
                    yearValue,
                    monthValue,
                    daysInAMonth(monthValue + 1, yearValue)
                ),
            };
        })
        .map((thisMonth) =>
            thisMonth.month === monthNames[currentMonth]
                ? { ...thisMonth, month: 'This month' }
                : { ...thisMonth }
        );
    const getCurrentDateIndex = monthInRange.findIndex(
        (currentMonth) => currentMonth.month === 'This month'
    );
    const finalMonthResult = monthInRange.map((month, index) =>
        index === getCurrentDateIndex - 1
            ? { ...month, month: 'Last month' }
            : { ...month }
    );
    return finalMonthResult;
};