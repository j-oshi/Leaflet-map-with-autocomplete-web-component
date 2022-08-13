const breakEven = (
    startupCost,
    fixedCost,
    variableCost,
    salesAmount,
) => {
    let result = null;
    result = startupCost / (salesAmount - (fixedCost + variableCost));
    return Math.ceil(result);
}

const calcuteRevenue = (
    startupCost,
    fixedCost,
    variableCost,
    salesAmount,
    durationOfSales
) => {
    let revenue = null;
    revenue = (durationOfSales * salesAmount) - (startupCost + (durationOfSales * (fixedCost + variableCost)));
    return revenue;
};

const operatingProfit = (
    fixedCost,
    variableCost,
    salesAmount,
    decimal = 2
) => {
    let result = null;
    result = (salesAmount - (fixedCost + variableCost));
    return result.toFixed(decimal);
}

export {
    breakEven,
    calcuteRevenue,
    operatingProfit
};