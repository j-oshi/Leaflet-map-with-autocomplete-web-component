let monthlyPayment = (annualRate = 0, loanTerm = 0, loanPrincipal = 0) => {
    let monthlyInterestRate = null, monthlyPaymentValue = null;
    monthlyInterestRate = (annualRate / 12) * (1/100);
    monthlyPaymentValue = (monthlyInterestRate * loanPrincipal) / (1 - ((1 + monthlyInterestRate) ** -loanTerm));
    return { monthlyInterestRate, monthlyPaymentValue};
}

let totalInterestToPay = (monthlyPayment = 0, loanTerm = 0, loanPrincipal = 0) => {
    return (monthlyPayment * loanTerm) - loanPrincipal;
}

let amountOwedAfter = (monthlyInterestRate, monthlyPaymentValue, loanPrincipal, numberOfMonths) => {
    return (((1 + monthlyInterestRate) ** numberOfMonths) * loanPrincipal) - (((((1 + monthlyInterestRate) ** numberOfMonths) - 1) / monthlyInterestRate) * monthlyPaymentValue);
}

let monthlyPaymentValue = null;
monthlyPaymentValue = monthlyPayment(3.75, 360, 200000);
monthlyPaymentValue = monthlyPayment(1.5, 360, 250000);
console.log(monthlyPaymentValue);
console.log(totalInterestToPay(monthlyPaymentValue.monthlyPaymentValue, 360, 200000));
console.log(amountOwedAfter(monthlyPaymentValue.monthlyInterestRate, monthlyPaymentValue.monthlyPaymentValue, 200000, 12));


let amortizationSchedule = (timeperiod, interestRate, periodType, loanPrincipal) => {
    let toTwoDecimal = value => {
        return Number.parseFloat(value).toFixed(2);
    }

    switch (periodType) {
        case 'monthly':
            schedulePeriod = 1;
            period = 12;
            break;
        case 'yearly':
            schedulePeriod = 12;
            period = 1;
            break;
        default:
            schedulePeriod = 12;
            period = 1;
    }

    let interest_rate = null, annualSchedule = [];
    interest_rate = interestRate * schedulePeriod;

    for (let i = 0; i < timeperiod * period; i++) {
        let schedule = {}, interest = null, principal = null, ending_balance = null;
    
        schedule['id'] = i;
        schedule['balance'] = (loanPrincipal >= 0) ? loanPrincipal : 0;
        interest = toTwoDecimal((loanPrincipal * interest_rate)); 
        schedule['interest'] = (interest >= 0) ? interest : 0;
        principal = toTwoDecimal(((monthlyPaymentValue.monthlyPaymentValue * schedulePeriod) - interest));
        schedule['principal'] = (principal >= 0) ? principal : 0;
        ending_balance = toTwoDecimal((loanPrincipal - principal));
        schedule['ending_balance'] = (ending_balance >= 0) ? ending_balance : 0;
        loanPrincipal = toTwoDecimal((ending_balance));
        annualSchedule.push(schedule);
    }
    return annualSchedule;
}

// console.log(amortizationSchedule(30, monthlyPaymentValue.monthlyInterestRate, 'yearly', 200000))
// console.log(amortizationSchedule(30, monthlyPaymentValue.monthlyInterestRate, 'monthly', 200000))