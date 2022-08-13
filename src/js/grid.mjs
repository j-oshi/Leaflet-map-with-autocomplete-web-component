'use strict';
const grid = {
    size: {
        row: 0,
        column: 0
    },
    func: function(){},
    setSize: function(row = 0, column = 0) {
        this.size.row = row;
        this.size.column = column;
    },
    getSize: function() {
        return {
            row: this.size.row,
            column: this.size.column
        }
    },
    createGrid: function() {
        let row = [];
        for (let i = 0; i < this.size.row; i++) {
            if (this.size.column > 0) {
                let column = [];
                for (let j = 0; j < this.size.column; j++) {
                    column.push(this.getCellFunction(i, j));
                }
                row.push(column);
            } else {
                row.push(this.getCellFunction(i));
            }
        }
        return row;
    },
    setCellFunction: function(func) {
        this.func = func;
    },
    getCellFunction: function(...arg) {
        return this.func(...arg);
    },
    print: function() {
        console.log(this.createGrid());
    },
    printTable: function() {
        console.table(this.createGrid());
    },
    matrix: function() {
        return this.createGrid();
    }
};



const generateGridCellData = numberOfRows => {
    if (!(numberOfRows > 0)) return[];

    let headerRow = [], bodyRow = [];
    for (let hr = 0; hr < numberOfRows; hr++) {
      if (hr === 0) {
        headerRow.push(`&nbsp`);
      } else {
        headerRow.push(`<input class="destination-cell-header" type="text" placeholder="Enter Title" data-title="${hr}-1"/>`);
      }
    }

    for (let br = 1; br < numberOfRows; br++) {
      let dataCell = [];
      for (let bc = 0; bc < numberOfRows; bc++) {
        if (bc === 0) {
          dataCell.push(`<input class="destination-cell" type="text" placeholder="Enter Title" data-title-side="${(br)}"/>`);
        } else if (br === bc) {        
          dataCell.push(`<input class="destination-cell" type="number" step="any" placeholder="Enter Distance" value="0" data-x="${br}" data-y="${(bc - 1)}" data-xy="${br}${(bc - 1)}" />`);
        } else {
          dataCell.push(`<input class="destination-cell" type="number" step="any" placeholder="Enter Distance" data-x="${br}" data-y="${(bc - 1)}" data-xy="${br}${(bc - 1)}" />`); 
        }
      }
      bodyRow.push(dataCell);
    }

    return [headerRow].concat(bodyRow);
}

export {
    generateGridCellData
}


let test = grid;

test.setSize(9, 9);
function addBy(a) {
    return function(b, c) {
        return a + (b * c);
    }
}
let yef = addBy(5);
test.setCellFunction(yef);
test.print();
let f = test.matrix();
console.log(f[6][8])

// test.setSize(6,6);
// function quadratic(x) {
//     return function(a, b) {
//        return (a * x**2) + (b * x) + 1;
//     }
// }

// let x = quadratic(2);
// test.setCellFunction(x);
// test.print();

test.setSize(6,6);
// function quadratic(x) {
//     return function(a, b) {
//        return b**2 + (2 * a * b) + 11 - (16 * a);
//     }
// }

// function zIndex(a, b) {
//     return b**2 + (2 * a * b) + 11 - (16 * a); 
// }

function zIndex(a, b) {
    return Math.sqrt(a**2 + b**2);
}

test.setCellFunction(zIndex);
test.print();


function inputCreation(a,b) {
    return `<input type="text" id="${a}${b}"/>`
}
test.setCellFunction(inputCreation);
// test.print();
let node = test.matrix();
console.log(node);