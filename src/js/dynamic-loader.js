'use strict';
const loadSingleComponent = ({
    // Elements selectors
    els = [],

    fileToLoad,

    // Perform module load & return a Promise
    load,

    // loadFunc,
}) => {
    if (els && {}.toString.call(els) === '[object Function]') {
        els = els()
    }

    const allEls = (Array.isArray(els) ? els : [els]).reduce(
        (a, selector) => [...a,
        ...(Array.isArray(selector) ? selector : document.querySelectorAll(selector)),
        ], []
    )

    if (allEls.length === 0) {
        return
    }

    // Prevent loading of a file more than once.
    let loadedFile = [];
    if (loadedFile.includes(fileToLoad)) {
        return;
    } else {
        loadedFile.push(fileToLoad);
    }

    load().then((arg) => arg)
}

export const handleEntryPoints = (mountEntryPoints = []) => {
    document.addEventListener(
        'DOMContentLoaded',
        () => mountEntryPoints.map(loadSingleComponent),
        false
    )
}