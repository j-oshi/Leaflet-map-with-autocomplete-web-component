export class DoubleRangeSlider extends HTMLElement { 
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.sliderStyle = {
            trackColor: '#dadae5',
            rangeColor: '#3264fe',
        };
        this.RANGE = ['min-value', 'max-value'];
        this.CONVERTEDRANGE = ['conv-min-value', 'conv-max-value'];
        this.SETTING = {
            min: null,
            max: null,
            step: null,
            minvalue: null,
            maxvalue: null,
            outputDisplay: {
                left: null,
                right: null
            },
            valueConverter: null
        }
        this.output = [];
        this.hasAttribute('type') && this.getAttribute('type') === 'range' 
            ? "" : this.setAttribute('type', 'range');
        this.fillColor = this.fillColor.bind(this);
    }

    connectedCallback() {
        this.setSliderAttribute();
        this.render();

        this.rangeElement = this.shadowRoot.querySelector('.slider-container');
        this.handles = [...this.rangeElement.querySelectorAll('input[type="range"]')];
        this.sliderTrack = this.rangeElement.querySelector('.slider-track');

        this.resultToExternalOutput();

        let handles = null, output = null;
        handles = this.handles;
        output = this.output;
        if (!(handles.length > 0)) return;

        this.fillColor(handles);
        let [leftSlider, rightSlider] = handles;
        handles.forEach((e , index)=> {
            this.displayInExternalOutput(e, index);
            this.setAttribute(this.CONVERTEDRANGE[index], this.slideValue(e));
            e.addEventListener('input', () => {
                this.fillColor(handles);
                this.setAttribute(this.RANGE[index], e.value);
                this.setAttribute(this.CONVERTEDRANGE[index], this.slideValue(e));
                this.displayInExternalOutput(e, index);

                // leftSlider.setAttribute('value', e.value);
                
                // console.log(rightSlider)
                if (index === 0) {
                    leftSlider.setAttribute('value', e.value); 
                }
                if (index === 1) {
                    rightSlider.setAttribute('value', e.value);   
                }
            });            
        })
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
            .slider-container {
                display: inline-block;
                position: relative;
                width: 100%;
                height: 28px;
              }
              .slider-track {
                width: 100%;
                height: 3px;
                position: absolute;
                margin: auto;
                top: 0;
                bottom: 0;
                border-radius: 5px;
              }
              .slider-container>input[type="range"] {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                position: absolute;
                margin: auto;
                top: 0;
                bottom: 0;
                width: 100%;
                outline: none;
                background-color: transparent;
                pointer-events: none;
              }
              .slider-container>input[type="range"]::-webkit-slider-runnable-track {
                -webkit-appearance: none;
                height: 5px;
              }
              .slider-container>input[type="range"]::-moz-range-track {
                -moz-appearance: none;
                height: 5px;
              }
              .slider-container>input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                margin-top: -9px;
                height: 1.5em;
                width: 1.5em;
                background-color: #3264fe;
                cursor: pointer;
                pointer-events: auto;
                border-radius: 50%;
              }
              .slider-container>input[type="range"]::-moz-range-thumb {
                -moz-appearance: none;
                height: 1.5em;
                width: 1.5em;
                cursor: pointer;
                border: none;
                border-radius: 50%;
                background-color: #3264fe;
                pointer-events: auto;
              }
              .slider-container>input[type="range"]:active::-webkit-slider-thumb {
                content: attr("5");
                background-color: #ffffff;
                border: 3px solid #3264fe;
              }
            </style>
            <div class="slider-container">
                <div class="slider-track"></div>
                <input type="range" name="a" min=${this.SETTING.min} max=${this.SETTING.max} step=${this.SETTING.step} value=${this.SETTING.minvalue === null ? this.SETTING.min : this.SETTING.minvalue} autocomplete="off" />
                <input type="range" name="a" min=${this.SETTING.min} max=${this.SETTING.max} step=${this.SETTING.step} value=${this.SETTING.maxvalue === null ? this.SETTING.max : this.SETTING.maxvalue} autocomplete="off" />
            </div>`;
    }

    get convertValue() {
        return this.SETTING.valueConverter;
    }
    
    set convertValue(val) {
        this.SETTING.valueConverter = val;
    }

    setSliderAttribute() {
        this.SETTING.min = this.hasAttribute("min") ? this.getAttribute("min") : 0;
        this.SETTING.max = this.hasAttribute("max") ? this.getAttribute("max") : 100;
        this.SETTING.step = this.hasAttribute("step") ? this.getAttribute("step") : 1;
        this.SETTING.minvalue = this.hasAttribute("min-value") ? this.getAttribute("min-value") : null;
        this.SETTING.maxvalue = this.hasAttribute("max-value") ? this.getAttribute("max-value") : null;
    }

    resultToExternalOutput() {
        if (this.previousElementSibling && this.previousElementSibling.tagName === "SPAN") {
            this.output.push(this.previousElementSibling)
        }

        if (this.nextElementSibling && this.nextElementSibling.tagName === "SPAN") {
            this.output.push(this.nextElementSibling)
        }
    }

    slideValue(el) {
        let convertedResult = null;
        convertedResult = this.convertValue !== null ? this.convertValue(el.value) : el.value;
        return convertedResult;
    }

    displayInExternalOutput(el, index) {
        if (this.output.length === 2) {
            this.output[index].innerHTML = this.slideValue(el);
        }       
    }

    fillColor(sliderColor) {
        let overallMax = null, overallMin = null, overallRange = null, lf = null, rt = null;
        let [leftSlider, rightSlider] = sliderColor;
        overallMax = rightSlider.max;
        overallMin = leftSlider.min;
        overallRange = overallMax - overallMin;
        lf = ((leftSlider.value - overallMin) / overallRange * 100) + '%';
        rt = ((rightSlider.value - overallMin) / overallRange * 100) + '%';
        let { trackColor, rangeColor } = this.sliderStyle;
        this.sliderTrack.style.background = `linear-gradient(to right, ${trackColor} ${lf}, ${rangeColor} ${lf}, ${rangeColor} ${rt}, ${trackColor} ${rt})`;
    };
};
customElements.define('double-range-slider', DoubleRangeSlider);