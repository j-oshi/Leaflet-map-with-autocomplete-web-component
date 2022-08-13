const degrees_to_radians = deg => (deg * Math.PI) / 180.0;

const calculate_distance = (coordinateA, coordinateB) => {
    let dlon = null, dlat = null, R = null, a = null, c = null;
    dlon = degrees_to_radians(parseFloat(coordinateB.longitude)) - degrees_to_radians(parseFloat(coordinateA.longitude));
    dlat = degrees_to_radians(parseFloat(coordinateB.latitude)) - degrees_to_radians(parseFloat(coordinateA.latitude));

    R = 6373.0;     
    a = Math.sin(dlat / 2)**2 + Math.cos(parseFloat(coordinateA.latitude)) * Math.cos(parseFloat(coordinateB.latitude)) * Math.sin(dlon / 2)**2;
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const distanceMatrix = (coordinates) => {
    let row = [];
    for (let i = 0; i < coordinates.length; i++) {
        let column = [];
        for (let j = 0; j < coordinates.length; j++) {
            column.push(calculate_distance(coordinates[i], coordinates[j]));
        }
        row.push(column);
    }
    return row;
};

const createDistanceMatrixTable = (header, data) => {
    let table = null, tableHead = null, tableBody = null, htr = null, btr =null, td = null, headerRow = null;

    tableHead = document.createElement("thead");
    htr = document.createElement("tr");
    headerRow = document.createElement("th");
    headerRow.innerHTML = `&nbsp`;
    htr.appendChild(headerRow);

    // Create table header
    header.forEach(elText => {
        headerRow = document.createElement("th");
        headerRow.textContent = elText;
        htr.appendChild(headerRow);
    });

    table = document.createElement("table");
    tableHead.appendChild(htr);
    table.appendChild(tableHead);

    // Create table body
    tableBody = document.createElement("tbody");
    data.forEach((distances, index) => {
        btr = document.createElement("tr");
        td = document.createElement("td");
        td.setAttribute('class', 'titleRow');
        td.textContent = header[index];
        btr.appendChild(td);

        for (let distance in distances) {
            td = document.createElement("td");
            td.textContent = (distances[distance] === 0) ? parseFloat(distances[distance]).toFixed(0) : parseFloat(distances[distance]).toFixed(4);
            btr.appendChild(td);
        }
        tableBody.appendChild(btr);
    });
    table.appendChild(tableBody);
    document.getElementById('table').appendChild(table);
}

let rowMarkup = (name, latitude, longitude) => {
    let result = null;
    result = document.createElement('tr');
    result.innerHTML = `<td><input class="destination-cell" type="text" placeholder="Enter location" data-type="name" value="${name}"/></td>
    <td><input class="destination-cell" type="number" step="any" placeholder="Enter latitude" data-type="latitude" value="${latitude}"/></td>
    <td><input class="destination-cell" type="number" step="any" placeholder="Enter longitude" data-type="longitude" value="${longitude}"/></td>
    <td style="text-align:right"><button class="delete-row">delete</button></td>`;
    return result;
}

let deleteRow = () => {
    let deleteList = null;
    deleteList = document.querySelectorAll(".delete-row");
    [...deleteList].forEach(el => {
        let distanceCell = null;
        distanceCell = el.closest("tr");
        const removeCell = () => {
            distanceCell?.parentNode?.removeChild(distanceCell);
        }
        el.removeEventListener('click', removeCell);
        el.addEventListener('click', removeCell);
    })
};

const createLocationTable = (data) => {
    let tbody = null, maxTableLength = null;
    table = document.createElement("table");
    tbody = document.createElement("tbody");
    maxTableLength = (data.length > 50) ? 50 : data.length;

    for (let i = 0; i < maxTableLength; i++) {
        let rowMarkUp = null;        
        rowMarkUp = rowMarkup(data[i].name, data[i].latitude, data[i].longitude);
        tbody.appendChild(rowMarkUp);
    }
    table.appendChild(tbody);
    return table;
};

const getCsvData = () => {
    let uploadedData = null;
    uploadedData = document.querySelector("#upload");
    return new Promise((resolve, reject) => {
      let reader = null;
      reader = new FileReader()
      reader.readAsBinaryString(uploadedData.files[0])
      reader.onload = function (e) {
        resolve(reader.result)
      }
    });
};

const csvJSON = csv => {
    let lines = null, result = [], headers = null;
    lines = csv.split('\n')
    headers = lines[0].split(',')
  
    for (let i = 1; i < lines.length; i++) {
        let obj = {}, currentline = null;
        if (!lines[i]) continue;
        obj = {};
        currentline = lines[i].split(',');
  
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
};

const createCoordinateTable = (data) => {
    let routeList = null, routeCell = null;
    routeList = document.querySelector(".route-destinations");
    routeList.innerHTML = null; 
    routeList.appendChild(createLocationTable(data));
    deleteRow();
};

let fetchAndDecode = async (url, type, data = {}) => {
    let response = null, content = null;  
    response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
  
    if (!response.ok) {
        console.log(response);
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      if(type === 'blob') {
        content = await response.blob();
      } else if(type === 'text') {
        content = await response.text();
      } else if(type === 'json') {
        content = await response.json();
      }
    }  
    return content;
};

document.querySelector(".add-to-list").addEventListener('click', () => {
    let table = null;
    table = document.querySelector(".route-destinations tbody");
    table.appendChild(rowMarkup("", "", ""));
    deleteRow();
});

document.querySelector(".clear-upload").addEventListener('click', () => {
    let deleteList = null;
    deleteList = document.querySelector("#upload");
    deleteList.value = null;
    document.querySelector(".clear-upload").classList.add('hide-clear-upload');  
});

document.getElementById("upload").addEventListener('change', async () => {
    let getData = null, data = null;
    getData = await getCsvData();
    data = csvJSON(getData);
    document.querySelector('.clear-upload').classList.remove('hide-clear-upload');  
    createCoordinateTable(data);  
});

document.querySelector(".convert-to-distance-matrix").addEventListener('click', () => {
    let cellList = null, distanceObject = null, table = null;
    cellList = document.querySelectorAll(".route-destinations tr");
    distanceObject = [...cellList].map(row => {
        let inputBox = null;
        inputBox = [...row.querySelectorAll("input")];
        return({name: inputBox[0].value, latitude: inputBox[1].value, longitude: inputBox[2].value});
    });

    const coordinateNames = distanceObject.map(coordinate => {
        return coordinate.name;
    })

    table = document.getElementById('table');
    table.innerHTML = null;
    createDistanceMatrixTable(coordinateNames, distanceMatrix(distanceObject));
    let routeResult = document.querySelector('.optimized-route');
    fetchAndDecode(`http://localhost:8080/`, 'json', distanceObject).then(data => {
        routeResult.innerHTML = null
        routeResult.innerHTML = resultCard(routeLocation(data.result.route), 
            data.result.route_distance,
        )
    });
});

let coordinates = [
    {name: 'Farnborough', latitude: 51.28653312634952, longitude: -0.7519764246722932},
    {name: 'Guildford', latitude: 51.23764308689325,longitude: -0.5639666003933651},
    {name: 'Frimley', latitude: 51.31639068461945, longitude: -0.7424358553590537},
    {name: 'Woking', latitude: 51.3187422529986, longitude: -0.5686982343721042},
]

const coordinateNames = coordinates.map(coordinate => {
    return coordinate.name;
})

const routeLocation = (arr) => {
    let route = null;
    route = [...arr].map(el => {
        return el;
    }).join(" => ");
    return route;
}

const gridTable = (numberOfRows) => {
    let numberOfColumns = null, table = null, headerRow = null, bodyRow = null;
    numberOfColumns = numberOfRows + 1;
    table = document.createElement("table");
    
    headerRow = document.createElement("tr");
    for (let hr = 0; hr < numberOfColumns; hr++) {
        let headerCell = null;
        headerCell = document.createElement("th");
        if (hr !== 0) {
            headerCell.innerHTML = `<input class="destination-cell-header" type="text" placeholder="Enter Title" data-title="${(hr-1)}"/>`;
        } else {
            headerCell.innerHTML = `&nbsp`;
        }
        headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);
    document.getElementById('grid-table').appendChild(table);


    for (let br = 0; br < numberOfRows; br++) {
        let bodyRow = null;
        bodyRow = document.createElement("tr");
        for (let bc = 0; bc < numberOfColumns; bc++) {
            let dataCell = null;
            dataCell = document.createElement("td");
            if (bc === 0) {
                dataCell.innerHTML = `<input class="destination-cell" type="text" placeholder="Enter Title" data-title-side="${(br)}"/>`;
            }  else if ((br + 1) === bc) {        
                dataCell.innerHTML = `<input class="destination-cell" type="number" step="any" placeholder="Enter Distance" value="0" data-x="${br}" data-y="${(bc - 1)}" data-xy="${br}${(bc - 1)}" />`;
            } else {
                dataCell.innerHTML = `<input class="destination-cell" type="number" step="any" placeholder="Enter Distance" data-x="${br}" data-y="${(bc - 1)}" data-xy="${br}${(bc - 1)}" />`; 
            }
            bodyRow.appendChild(dataCell);
        }
        table.appendChild(bodyRow);
    }

    document.getElementById('grid-table').appendChild(table);
    syncTableTitle();
    syncTableCell();
};

const syncTableTitle = () => {
    let titleEl = null;
    titleEl = document.querySelectorAll("[data-title]");
    [...titleEl].forEach(el => {
        el.addEventListener("change", () => {
            let sideTitle = null;
            sideTitle = document.querySelector(`[data-title-side='${el.dataset.title}']`);
            sideTitle.value = el.value;
        });
    });
};

const syncTableCell = () => {
    let cellEl = null;
    cellEl = document.querySelectorAll("[data-xy]");
    [...cellEl].forEach(el => {
        el.addEventListener("change", () => {
            let cell = null, cellX = null, cellY = null, cellIsInvalid = null;
            cellX = el.dataset.x;
            cellY = el.dataset.y;
            cell = document.querySelector(`[data-xy='${cellY}${cellX}']`);
            cellIsInvalid = false;
            cell.value = el.value;
        });
    });
};

document.querySelector(".distance-matrix-to-object").addEventListener('click', () => {
    let grid = null, titleNodes = null, titleObject  = null, distanceObject = null, jsonObject = null, isValid = null;
    grid = document.querySelectorAll("#grid-table tr");
    let [theader, ...tbody] = [...grid];

    titleNodes = theader.querySelectorAll(".destination-cell-header");
    titleObject = [...titleNodes].map(el => {
        return el.value
    });

    distanceObject = tbody.map(rel => {
        let cellBoxes = null, cellTexts = null;
        cellBoxes = rel.querySelectorAll("input");
        let [cellHead, ...cellBody] = [...cellBoxes];
        cellTexts = cellBody.map(el => {   
            if (isIntegerOrFloat(el.value) === true) {
                el.style.backgroundColor = "#ff6666";
                isValid = false; 
            } else {
                el.style.backgroundColor = "#ffffff";           
            }
            return el.value;
        });
        return cellTexts;
    });

    if (isValid !== false) {
        jsonObject = {titles: titleObject, distanceMatrix: distanceObject};
        let routeResult = document.querySelector('.optimized-route-2');
        fetchAndDecode(`http://localhost:8080/ter/`, 'json', JSON.stringify(jsonObject)).then(data => {
            routeResult.innerHTML = null
            routeResult.innerHTML = resultCard(routeLocation(data.result.route), 
                data.result.route_distance,
            )
        });
    }
});

const isIntegerOrFloat = val => {
    if (Number.isInteger(Number(val)) && isNaN(parseFloat(val))) {
        return true;
    } else {
        return false;
    }
}

document.querySelector(".create-grid").addEventListener("click", () => {
    let inputValue = null, gridContainer = null;
    inputValue = document.querySelector("#grid-number")?.value;
    gridContainer = document.querySelector("#grid-table");
    gridContainer.innerHTML = null;
    if (parseInt(inputValue) > 10) return
    gridTable(parseInt(inputValue));
})

let acc = null;
acc = document.getElementsByClassName("accordion");

for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let panel = null;
    panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = "100%";
    }
  });
}

const resultCard = (route, distance) => {
    return `
        <div class="result-section">
            <div class="stat-card">
                <h3>Shortest route</h3>
                <h4 class="stat-num"><span class="txt-ontrack">${route}</span></h4>
                <div class="subtext"><strong>${distance}</strong></div>
            </div>
        </div>
    `;
};

// Route for vehicle 0:
//  0 -> 2 -> 3 -> 1 -> 0
// route-planner.js:249:17
// Farnborough => Frimley => Woking => Guildford route-planner.js:250:17
// Route distance: 33miles




















