'use strict';
const jsonToTable = (data, tableTitle = []) =>{
    if (!(data.length > 0)) return;

    let header = null, content = [];
    header = Object.keys(data[0]);
    data.forEach(row => {
        content.push(Object.values(row));
    });

    if (tableTitle.length > 0) {
        return [tableTitle].concat(content);
    }

    if (tableTitle.length === 0) {
        return [header].concat(content);
    }
}

const tableToCsv = (data) => {
    if (!(data.length > 0)) return;
    let content = null;
    content = data.map(row => {
        return row;
    });

    return content.join(`; ${`\n`}`);
}

export {
    jsonToTable,
    tableToCsv
};