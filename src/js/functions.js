/* Run function once */
let onceOnly = f => {
    let hasRun = false;
    return () => {
        if (!hasRun) {
            hasRun = true;
            return f();
        }
    }
}

let limitRuns = (f, timesToRun) => {
    let hasRun = 0;
    return () => {
        if (hasRun < timesToRun) {
            hasRun = hasRun + 1;
            return f();
        }
    }
}

let testOnlyOnce = onceOnly(() => {
    console.log('running ...');
});

let testLimitCall = limitRuns(() => {
    console.log('running multiple ...');
}, 4);

let controlTest = () => {
    console.log('control running ...');  
}

testOnlyOnce();
testOnlyOnce();
testOnlyOnce();

testLimitCall();
testLimitCall();
testLimitCall();
testLimitCall();
testLimitCall();
testLimitCall();
testLimitCall();

controlTest();
controlTest();
controlTest();