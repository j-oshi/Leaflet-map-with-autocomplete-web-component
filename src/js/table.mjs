const table = () => {
    let tableEl = document.createElement("table");

    const createCaption = content => {
        if (content && typeof content === "string") {
            let caption = null;
            caption = document.createElement("caption");
            caption.textContent = content;
            tableEl.prepend(caption);
        }
    }

    const _createHeader = content => {
        let row = null, cell = null;

        row = document.createElement("tr");
        row.setAttribute("row", 0);

        if (!(content.length >= 0)) return;

        content.forEach(el => {
            if (el === " ") return;
            cell = document.createElement("th");
            cell.innerHTML = el;
            row.appendChild(cell);
        });
        tableEl.appendChild(row);
    }

    const createBody = (data, horizontal_row = false) => {
        if (data.length < 1) return;

        let [header, ...content] = data;

        if (header) {
            _createHeader(header);
        }

        if (!horizontal_row) {
            if (!(content.length >= 0)) return;
            content.forEach((row, index) => {
                let tr = document.createElement("tr");
                tr.setAttribute("row", index + 1);
                row.forEach(col => {
                    if (!col && col === "" && col !== 0) return;
                    let td = document.createElement("td");
                    td.innerHTML = col;
                    tr.appendChild(td);
                })
                tableEl.appendChild(tr);
            });
        }

        if (horizontal_row) {
            if (!(content.length >= 0)) return;
            content.forEach((row, rindex) => {
                let tr = document.createElement("tr");
                tr.setAttribute("row", rindex + 1);
                row.forEach((col, index) => {
                    if (index === 0) {
                        if (!col && col === "" && col !== 0) return;
                        let th = document.createElement("th");
                        th.innerHTML = col;
                        tr.appendChild(th);                        
                    }

                    if (index !== 0) {
                        if (!col && col === "" && col !== 0) return;
                        let td = document.createElement("td");
                        td.innerHTML = col;
                        tr.appendChild(td);
                    }
                })
                tableEl.appendChild(tr);
            });
        }

    }

    const addTableSpan = data =>{
        if (!(data.length > 0)) return;

        let tableRows = null, tableRowsFiltered = null;
        tableRows = tableEl?.childNodes;
        tableRowsFiltered = [...tableRows].filter(row => row.tagName === "TR");

        [...data].forEach(drow => {
            let tableEl = null, tableElCol = null;
            tableEl = tableRowsFiltered.filter(row => row.getAttribute("row") == drow.row);
            if (!(tableEl.length > 0)) return;

            if (!(tableEl[0]?.childNodes.length > 0)) return;

            tableElCol = tableEl[0]?.childNodes[drow.col];

            if (drow.rowspan > 0) {
                tableElCol.setAttribute("rowspan", drow.rowspan)
            }

            if (drow.colspan > 0) {
                tableElCol.setAttribute("colspan", drow.rowspan)
            }
        });
    }

    const escapeString = item => (typeof item === 'string') ? `"${item}"` : String(item)

    const arrayToCsv = (arr, seperator = ';') => arr.map(escapeString).join(seperator)

    const rowKeysToCsv = (row, seperator = ';') => arrayToCsv(Object.keys(row))

    const rowToCsv = (row, seperator = ';') => arrayToCsv(Object.values(row))

    const rowsToCsv = (arr, seperator = ';') => arr.map(row => rowToCsv(row, seperator)).join('\n')

    const collectionToCsvWithHeading = (arr, seperator = ';') => `${rowKeysToCsv(arr[0], seperator)}\n${rowsToCsv(arr, seperator)}`;

    const getAllTables = () => {
        return document.querySelectorAll("table");
    }

    const tableRowsData = node => {
        return [...node.querySelectorAll("table tr")].map(tr => [...tr.querySelectorAll('*')].map(tc => tc.textContent));
    }
    
    const tableToCsv = () => {
        let tables = null, data = null;
        tables = getAllTables();
        data = [...tables].map(tabelEl => {
            let captionEl = null, rows = null, dataArr = [];
            if (captionEl) {
                captionEl = tabelEl.querySelector("table caption");
                dataArr.push([captionEl.innerHTML]);
            }
            rows = tableRowsData(tabelEl);
            dataArr.push(...rows)
            return collectionToCsvWithHeading(dataArr);
        })
        return data;
    }   

    const tableToJson = (tableKey) => {
        let tables = null, data = null;
            tables = getAllTables();

            data = [...tables].map(tabelEl => {
                let captionEl = null, tableObj = {}, arrayKey = [];
                captionEl = tabelEl.querySelector("table caption");
                if (captionEl) {
                    tableObj.caption = captionEl.innerHTML;
                }

                let [header, ...rows] = tableRowsData(tabelEl);

                if (header.length === tableKey.length) {
                    arrayKey = tableKey;
                } else {
                    arrayKey = header;
                }

                tableObj.header = header.map((th, index) => {
                    let obj = {};
                    obj[arrayKey[index]] = th;
                    return obj;
                })
                
                tableObj.content = rows.map(tr => {
                    if (tr.length > 1) {
                        let obj = {};
                        for (let i = 0; i < header.length; i++) {
                            obj[arrayKey[i]] = tr[i];
                        }
                        return obj;
                    } else {
                        return { title: tr[0] }
                    }
                })
                return tableObj;
            });
            return data;
    }
    
    return {
        caption: captions => createCaption(captions),
        build: (data, hr) => createBody(data, hr),
        display: () => tableEl,
        saveToCSV: () => tableToCsv(),
        saveToJson: (tableKey = []) => tableToJson(tableKey),
        addTableSpan: data => addTableSpan(data)
    }
};

export {
    table
};