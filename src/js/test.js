// import { addState } from './state.mjs';

// let stateTest = {};
// let control = [{state1: 'top'}, {state2: 'right'}, {state3: 'bottom'}, {state4: 'left'}];
// addState(stateTest, control);

// let control2 = [{state5: {controlstate: 'off'}}];
// addState(stateTest, control2);

// stateTest.state5.controlstate = 'lalala';

// // delete stateTest.state5.controlstate;

// console.log(stateTest);

// const _pipe = (a, b) => (...args) => b(a(args));
// const pipe = (...ops) => ops.reduce(_pipe)

// const addByTwo = (x, y) => x + y;
// const debugPipe = (x, y) => console.log(x + " " + y);
// const calcTotalWithTax = pizzaCost => pizzaCost * 1.13
// const costForTwo = itemCost => Math.round(itemCost/2 * 100) / 100
// const cadToUSD = (cad) => Math.round(cad * 0.753653*100)/100;
// const costPerPersonUsd = pipe(addByTwo, debugPipe, calcTotalWithTax, costForTwo, cadToUSD);
// console.log(`You have to pay $ ${costPerPersonUsd(5, 2)} US.`);


// const schools = [
//     { name: "St. Marcellinus Secondary School", address: "730 Courtneypark Drive West" },
//     { name: "Sir William Mulock S.S.", address: "705 Columbus Way" },
//     { name: "George Harvey Collegiate Institute", address: "1700 Keele St" },
//     { name: "Dr. G.W. Williams S.S.", address: "39 Dunning Ave." },
//     { name: "Weston Collegiate Institute", address: "100 Pine St" }
//   ];
//   const _pipe = (a, b) => (arg) => b(a(arg));
//   const pipe = (...ops) => ops.reduce(_pipe);
  
  //1. Iterate over the array of schools
  //2. Make a li element containing the school name and address separated by '-'
  //3. Append the li to the ul with an id of 'school-list'
  
//   const makeLi = (schoolObj) => {
//     const newLI = document.createElement('li');
//     newLI.appendChild(document.createTextNode(`${schoolObj.name} - ${schoolObj.address}`));
//     return newLI
//   }
//   const appendLiToSchoolList = (li) => {
//     let schoolList = document.querySelector('#school-list');
//     return schoolList.appendChild(li);
//   }
//   const generateLi = pipe(makeLi,appendLiToSchoolList);
  
//   schools.forEach(school => generateLi(school));

// const multiplyBy = (x, y) => x * y;
// const addByTwo = x => x + 2;
// const multiplyByTwo = x => x * 2;
// const pipe = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));
// console.log(pipe(
//     multiplyBy,
//     addByTwo,
//     multiplyByTwo
//  )(2, 4));

// let functionArray = [addByTwo, multiplyByTwo];
// let pipeFuntions = () => functionArray.reduce((previousValue, currentValue) => previousValue += currentValue);
// console.log(pipe(
//     pipeFuntions
//  )(2));

// console.log(
//     multiplyBy,
//     addByTwo,
//     multiplyByTwo
//  );

const equals = (a, b) => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return a === b;
  if (a.prototype !== b.prototype) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => equals(a[k], b[k]));
};

const a = { name: 'John', age: 26 };
const b = { name: 'John', age: 26 };

console.log(equals(a, b)); // true

const c = { name: 'John' };
const d = { name: 'John', age: undefined };

console.log(equals(c, d)); // false

console.log(typeof "12/06/2022")