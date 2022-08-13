'use strict';
const createState = (defaultValue = 0) => {
    let state = null;
    state = defaultValue;

    const getState = () => state;
    const setState = newValue => {
        if (typeof newValue === 'function') {
            state = newValue(state);
            return;
        }
        state = newValue;
    }
    return [getState, setState];
}

const createStore = () => {
    let state = {};

    const getState = (prop = null) => {
        if (prop) {
            return state[prop];
        }
        return state;
    };

    const dispatch = (actionKey, payload) => {
        let previousState = null;
        previousState = getState();
        state = reducer(previousState, actionKey, payload);
    }

    const reducer = (state, actionKey, payload) => {
        switch (actionKey) {
            case 'SET':
                if (state[payload.type] === undefined) {
                    state[payload.type] = [];
                }
                state[payload.type].push(payload);
                break;
            case 'UPDATE':
                let previousObj = null;
                previousObj = state[payload.type].find((obj) => obj[payload.key] === payload.value);
                if (!(JSON.stringify(previousObj) === '{}')) {
                    Object.assign(previousObj, payload.obj);
                }
                break;
            case 'DELETE':
                state[payload.type] = state[payload.type].filter(obj => obj[payload.key] !== payload.value);
                break;
        }
        return state;
    }

    return {
        getState,
        dispatch
    }
};

export {
    createState,
    createStore
}

// let action = {
//   type: "test",
//   id: 92,
//   obj: {
//     id: 34775,
//     note: "this is a test"
//   }
// };

// let action2 = {
//   type: "test",
//   id: 58,
//   obj: {
//     id: 34575,
//     note: "this is a test 2"
//   }
// };

// let action3 = {
//   type: "test2",
//   id: 84,
//   obj: {
//     id: 34575,
//     note: "this is a test 2"
//   }
// };

// let action4 = {
//   type: "test2",
//   id: 231,
//   obj: {
//     id: 34575,
//     note: "this is a test 2"
//   }
// };

// let action5 = {
//   type: "test",
//   id: 231,
//   obj: {
//     id: 34575,
//     note: "this is a test 7"
//   }
// };

// let action7 = {
//   type: "test",
//   id: 231,
//   obj: {
//     id: 34575,
//     note: "this is a test 2"
//   }
// };

// let action6 = {
//   type: "test",
//   key: "id",
//   value: 231,
//   obj: {
//     type: "test",
//     id: 231,
//     obj: {
//       id: 3555,
//       note: "this is a an update"
//     }
//   }
// };

// let store = createStore();
// store.dispatch('SET', action);
// store.dispatch('SET', action2);
// store.dispatch('SET', action3);
// store.dispatch('SET', action4);
// store.dispatch('SET', action5);
// store.dispatch('SET', action7);
// store.dispatch('UPDATE', action6);
// // // store.dispatch('DELETE', {type: "test", key: "type", value: "test" });
// console.log(store.getState('test'));


// const [ {object: object}, setObject] = createState({
//     brand: "Ford",
//     model: "Mustang",
//     year: "1964",
//     color: "red"
// });

// console.log(object());

// setObject({ text: "this is a test" })

// console.log(object());

// setObject(prev => { return {...prev, color: "blue"} });;

// console.log(object());
