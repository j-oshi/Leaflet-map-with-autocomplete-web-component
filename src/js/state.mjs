const addState = (state, props) => {
    let stateKey = null;
    for (let key in props) {
        stateKey = Object.keys(props[key])[0];
        state[stateKey] = Object.values(props[key])[0];
    }
}

export {
    addState
};