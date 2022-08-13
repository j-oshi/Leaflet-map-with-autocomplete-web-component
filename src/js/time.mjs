const time = {
    constant: {
        DAY: [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
        ],
        MONTH: [
            'january',
            'february',
            'march',
            'april',
            'may',
            'june',
            'july',
            'august',
            'september',
            'october',
            'november',
            'december'
        ]
    },

    daysInAMonth: (month, year) => {
        return new Date(year, month, 0).getDate();
    },

    setDaysInAMonthForYear: (year, func) => {{
        return time.constant.MONTH.map((index, month) => {
            let obj = {};
            obj[index] = func(month + 1, year);
            return obj;
        });
    }},

    getDaysInAMonthForYear: year => {{
        return time.setDaysInAMonthForYear(year, time.daysInAMonth);
    }}
}

export {
    time
};