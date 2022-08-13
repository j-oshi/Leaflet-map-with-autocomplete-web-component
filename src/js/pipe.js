'use strict';
const pipe = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));

export {
    pipe
}