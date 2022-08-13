import { time } from './time.mjs';
import { DoubleRangeSlider } from '../web-components/double-range-slider.js';

const createCustomElement = (elType, elText = null, elTextType, attributes = []) => {
    let el = null;

    el = document.createElement(elType);
    if (elText !== null && elTextType === 'text') {
        el.textContent = elText; 
    } else if (elText !== null && elTextType === 'html') {
        el.textContent = elText; 
    }
    if (attributes.length > 0) {
        attributes.forEach(attr => {
            el.setAttribute(attr[0], attr[1]);
        }) 
    }
    return el;
}

const businessTimes = () => {
    let data = [];

    const setData = value => {
        if (value.length > 0) {
            data = value;
        }
    } 

    const getData = () => {
        return data;
    }

    const dayMarkUp = day => {
        let dayHtml = null;
        dayHtml = createCustomElement('div', day, 'html'); 
        return dayHtml;
    }

    const timeMarkUp = (times = []) => {
        if (!(times.length > 0)) return;
        let timeHtml = null;
        timeHtml = createCustomElement('div', null, 'text', [['class', 'business-period']]);
        times.forEach(timeEl => {         
            timeHtml.appendChild(createCustomElement('div', timeEl.time, 'text', [['class', 'business-open']]));            
        });
        return timeHtml;
    }

    const convertDataToHTML = (dataArray = []) => {
        if (!(dataArray.length > 0)) return;

        let timeContainer = null;
        timeContainer = createCustomElement('div', null, null, [['class', 'business-hours']]);

        dataArray.forEach(dayEl => {
            let dayContainer = null;
            dayContainer = createCustomElement('div', null, null, [['class', 'business-day'], ['data-day', dayEl.day]]);
            dayContainer.appendChild(dayMarkUp(dayEl.day));

            if (dayEl.period.length > 0) {
                dayContainer.appendChild(timeMarkUp(dayEl.period));
            } else {
                dayContainer.appendChild(createCustomElement('div', 'Closed', 'text', [['class', 'business-period'], ['class', 'business-closed']]));
            }
            timeContainer.appendChild(dayContainer);
        });

        return timeContainer;
    }

    const display = () => {
        return convertDataToHTML(getData());
    }

    const currentDateDisplay = () => {
        let getAllDisplay = null;
        getAllDisplay = document.querySelectorAll('.business-hours');

        if (!(getAllDisplay.length > 0)) return;

        let currentTime = null, currentDay = null;
        currentTime = new Date();
        currentDay = currentTime.getDay();
        [...getAllDisplay].forEach(el => {
            [...el.children].forEach(elch => {
                if (elch.classList.contains('IsOpenedToday') ) {
                    elch.classList.remove('IsOpenedToday'); 
                }

                if (elch.classList.contains('IsClosedToday') ) {
                    elch.classList.remove('IsClosedToday'); 
                }

                if (elch.dataset.day !== time.constant.DAY[currentDay]) return;
                
                if ((elch.children.length > 0)) {
                    elch.classList.add('IsOpenedToday'); 
                } else {
                    elch.classList.add('IsClosedToday');
                }
            });
        });
    }

    return {
        setData: data => setData(data),
        display: () => display(),
        currentDateDisplay: () => currentDateDisplay()
    }
}

const businessTimesPanel = () => {
    let html = null;

    const mainPanel = () => {
        html = createCustomElement('div', null, null, [['class', 'business-time-panel']]);
    }

    const dayPanel = (text, control) => {
        let panel = null, subPanelControl = null;
        panel = createCustomElement('div', null, null, [['class', 'day-time-panel'], ['data-day-time', text]]);
        panel.appendChild(createCustomElement('div', text, 'text', [['class', 'day-time-title']]));

        subPanelControl = createCustomElement('div', null, null, [['class', 'day-time-control']]);
        subPanelControl.appendChild(control);

        panel.appendChild(subPanelControl);
        html.appendChild(panel);
    }

    const dayPanelControl = () => {
        let panel = null, addButton = null, cloneButton = null, errorPanel = null, buttonPanel = null;
        panel = createCustomElement('div', null, null, [['class', 'day-time-control-buttons']]);

        errorPanel = createCustomElement('div', 'Please correct overlapping timeslots', 'text', [['class', 'day-time-error'], ["style", "visibility: hidden;"]]);
        panel.appendChild(errorPanel);

        buttonPanel = createCustomElement('div', null, null);

        addButton = createCustomElement('button', 'Add time', 'text', [['type', 'button']]);
        addButton.addEventListener('click', () => {
            addEvent(addButton);
        });
        buttonPanel.appendChild(addButton);

        cloneButton = createCustomElement('button', 'Clone pervious time', 'text', [['type', 'button']]);
        cloneButton.addEventListener('click', () => {
            cloneEvent(cloneButton);
        });

        buttonPanel.appendChild(cloneButton);
        panel.appendChild(buttonPanel);

        return panel;
    }

    const addEvent = el => {
        el.parentNode.parentNode.parentNode.insertBefore(openingTimeMarkup("0", "1440", "15", "0", "1440"), el.parentNode.parentNode);
    }

    const cloneEvent = el => {
        let panel = null, perviousPanel = null, perviousPanelTime = null;
        panel = el.closest('.day-time-panel');
        perviousPanel = panel.previousElementSibling;

        if (perviousPanel === null) return;
        perviousPanelTime = perviousPanel.querySelectorAll('.time-slider');

        if (perviousPanelTime.length > 0) {
            removeAllChildNodes(el);
            [...perviousPanelTime].forEach(prel => {
                let prel_clone = null;
                prel_clone = prel.cloneNode(true);
                prel_clone.childNodes[3].removeEventListener('click', () => {
                    removeThisNodes(prel_clone.childNodes[3]);
                });
                prel_clone.childNodes[3].addEventListener('click', () => {
                    removeThisNodes(prel_clone.childNodes[3]);
                });
                prel_clone.childNodes[1].convertValue = time => `${padMinutes(Math.floor(time/60))}:${(padMinutes(time%60))}`;
                el.parentNode.parentNode.parentNode.insertBefore(prel_clone, el.parentNode.parentNode);
            })
        }
    }

    const removeAllChildNodes = node => {
        let timeControl = null, timeNode = null
        timeControl = node.closest('.day-time-control');
        if (timeControl) {
            timeNode = [...timeControl.children].filter(el => el.classList.contains('time-slider'));
            timeNode.forEach(el => el.parentNode.removeChild(el));
        }
    }

    const removeThisNodes = node => {
        if (confirm("Delete this slider?") == true) {
            node.parentNode.parentNode.removeChild(node.parentNode);
        }    
    }

    const padMinutes = min => {
        if (min < 10) {
            return `0${min}`;
        }
        return min;
    }

    const openingTimeMarkup = (min, max, step, startValue, endValue) => {
        let wrapper = null, lspan = null, rspan = null, slider = null, deleteButton = null;
        wrapper = createCustomElement('div', null, null, [['class', 'time-slider']]);
        lspan = document.createElement('span');
        rspan = document.createElement('span');
        deleteButton = createCustomElement('button', 'Delete', 'text', [['class', 'button condensed delete']]);
        deleteButton.addEventListener('click', () => {
            removeThisNodes(deleteButton);
        });
        slider = new DoubleRangeSlider();
        slider.setAttribute("min", min);
        slider.setAttribute("max", max);
        slider.setAttribute("step", step);
        slider.setAttribute("min-value", startValue);
        slider.setAttribute("max-value", endValue);
        slider.convertValue = time => `${padMinutes(Math.floor(time/60))}:${(padMinutes(time%60))}`;
        wrapper.appendChild(lspan);
        wrapper.appendChild(slider);
        wrapper.appendChild(rspan);
        wrapper.appendChild(deleteButton);

        return wrapper;
    }

    const saveTimes = () => {
        let panel = null, saveButton = null;
        panel = createCustomElement('div', null, null, [['class', 'day-time-save-buttons']]);

        saveButton = createCustomElement('button', 'Save time', 'text', [['type', 'button']]);
        saveButton.addEventListener('click', () => {
            removeOldTime();
            getData();
        });
        panel.appendChild(saveButton);
        html.appendChild(panel);       
    }

    const display = () => {
        mainPanel();
        time.constant.DAY.forEach(day => {
            dayPanel(day, dayPanelControl()); 
        })
        saveTimes();
        return html;
    }

    const getData = () => {
        let el = null, elData = null, errorCheck = null, errorExist = null;
        el = html.querySelectorAll(".day-time-panel");
        if (!(el.length > 0)) return;
        elData = [...el].map(e => {
            let test = businessTimesPanelValidator();
            if (test.check(getInterData(e))) {
                e.querySelector(".day-time-error").removeAttribute("style");
            } else {
                if (e) {
                    e.querySelector(".day-time-error").setAttribute("style", "visibility: hidden;");
                }
            }
            return {
                day: e.getAttribute("data-day-time"),
                period: [...e.querySelectorAll("double-range-slider")].map(ed => {
                    return {
                        time: `${ed.hasAttribute("conv-min-value") ? ed.getAttribute("conv-min-value") : ed.hasAttribute("conv-min-value")} - ${ed.hasAttribute("conv-max-value") ? ed.getAttribute("conv-max-value") : ed.getAttribute("max-value")}`
                    }
                })
            }
        });

        errorCheck = html.querySelectorAll('.day-time-error');
        errorExist = [...errorCheck].filter(el => el.hasAttribute('style'));
        if (errorExist.length < 7) return;

        let businessdemo = businessTimes();
        businessdemo.setData(elData);
        html.appendChild(businessdemo.display()); 
        businessdemo.currentDateDisplay();
    }

    
    const removeOldTime = () => {
        let oldTime = null;
        oldTime = html.querySelector('.business-hours')
        if (oldTime) {
            oldTime.parentNode.removeChild(oldTime);
        }
    }

    const getInterData = el => {
        let elData = [];
        if (el === null || el === undefined) return;
        [...el.querySelectorAll("double-range-slider")].forEach(ed => {
            let elSubData = [];
            elSubData.push(ed.getAttribute("conv-min-value"));
            elSubData.push(ed.getAttribute("conv-max-value"));
            elData.push(elSubData);
        })
        return elData;
    }

   const restoreState = (data = []) => {
        if (!(data.length > 0)) return;

        let timePanels = null;
        timePanels = html.querySelectorAll('.day-time-panel');
        [...timePanels].forEach(panel => {
            if (panel.hasAttribute('data-day-time')) {
                let tpanel = null, tpanelAttr = null, tpanelData;
                tpanelAttr = panel.getAttribute('data-day-time');
                tpanelData = data.find(item => item.day === tpanelAttr);
                if (tpanelData.period && tpanelData.period.length > 0) {
                    tpanel = panel.querySelector('.day-time-control-buttons');
                    tpanelData.period.forEach(dt => {
                        let minDt = null, maxDt = null, validator = null, dtStartEnd = null;
                        dtStartEnd = dt.time.split('-');
                        validator = businessTimesPanelValidator()
                        minDt = validator.convertTimeToNumber(dtStartEnd[0]) * 60, maxDt = validator.convertTimeToNumber(dtStartEnd[1]) * 60;
                        tpanel.parentNode.insertBefore(openingTimeMarkup("0", "1440", "15", minDt, maxDt), tpanel);
                    }) 
                }                
            }
        })   
   }

    return {
        display: () => display(),
        restoreState: data => restoreState(data)
    }
}

const businessTimesPanelValidator = () => {
    let INTERVALS = [];

    const setIntervals = value => {
        INTERVALS = value;
    }

    const getIntervals = () => {
        return INTERVALS;
    }

    const convertTimeToNumber = time => {
        let hours = null, minutes;
        hours = Number(time.split(':')[0]);
        minutes = Number(time.split(':')[1]) / 60;
        return hours + minutes;
    }

    const sortIntervals = intervals => {
      return intervals.sort((intA, intB) => {
        let startA = null, endA = null, startB = null, endB = null;

        startA = convertTimeToNumber(intA[0]);
        endA = convertTimeToNumber(intA[1]);

        startB = convertTimeToNumber(intB[0]);
        endB = convertTimeToNumber(intB[1]);

        if (startA > endB) {
          return 1
        }

        if (startB > endA) {
          return -1
        }

        return 0;
      })
    }

    const isOverlapping = (intervals, newInterval) => {
        let a = null, b = null;
        a = convertTimeToNumber(newInterval[0]);
        b = convertTimeToNumber(newInterval[1]);

        for (const interval of intervals) {
            let c = null, d = null;
            c = convertTimeToNumber(interval[0]);
            d = convertTimeToNumber(interval[1]);

            if (a < d && b > c) {
                return {
                    newInterval,
                    interval,
                    isOverlap: true
                };
                // console.log('This one overlap: ', newInterval);
                // console.log('with interval: ', interval);
                // console.log('----');
                // return true;
            }
            return {
                newInterval: null,
                interval: null,
                isOverlap: false
            }
        }
    }

    const check = interval  => {
        if (!(interval .length > 0)) return;
        setIntervals(interval);

        let sortedInterval = [], badCount = 0, overlapIntervals = [];
        sortedInterval = sortIntervals(getIntervals())
        sortedInterval.forEach(inval => {
            if (inval.length !== 2) return;

            let remains = [];
            remains = sortedInterval.filter(el => el !== inval);
   
            if (isOverlapping(remains, inval)?.isOverlap === true) {
                overlapIntervals.push([isOverlapping(remains, inval)?.newInterval, isOverlapping(remains, inval)?.interval]);
                badCount += 1
            }
        });

        sortedInterval.length = 0;
        overlapIntervals.length = 0;
        return badCount > 0 ? true : false;
    }

    return {
        check: data => check(data),
        convertTimeToNumber: time => convertTimeToNumber(time)
    }
}

export {
    businessTimes,
    businessTimesPanel
}