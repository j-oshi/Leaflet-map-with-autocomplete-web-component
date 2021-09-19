import { config } from '../../config.js';

export class GeocoderAutocomplete extends HTMLElement {
  static get observedAttributes() {
    return [ 'selected-address'];
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.init();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.updateSearchBox(newVal);
    }
  }

  updateSearchBox(value) {
    let searchInput = null;
    searchInput = this.shadowRoot.querySelector('.searchTerm');  
    searchInput.value = value;  
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = `
        <style>
          .search {
            width: 100%;
            position: relative;
            display: flex;
          }
          
          .searchTerm {
            width: 100%;
            border: 1px solid #ffffff;
            border-right: none;
            background: transparent;
            padding: 7px;
            height: 20px;
            border-radius: 5px 0 0 5px;
            outline: none;
            color: #ffffff;
          }
          
          .searchTerm:focus{
            color: #ffffff;
          }
          
          .searchButton {
            width: 40px;
            height: 36px;
            border: 1px solid #ffffff;
            background: #ffffff;
            text-align: center;
            color: #fff;
            border-radius: 0 5px 5px 0;
            cursor: pointer;
            font-size: 20px;
          }
          
          /*Resize the wrap to see the search bar change!*/
          .wrap{
            width: 100%;
          }  
          
          ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: #ffffff;
            opacity: 1; /* Firefox */
          }
          
          :-ms-input-placeholder { /* Internet Explorer 10-11 */
            color: #ffffff;
          }
          
          ::-ms-input-placeholder { /* Microsoft Edge */
            color: #ffffff;
          }
        </style>
        <div class="wrap">
            <div class="search">
                <input type="text" class="searchTerm" autocomplete="off" placeholder="Enter location ...">
                <button type="submit" class="searchButton">
                <i class="fa fa-search"></i>
                </button>
            </div>
        </div>`;
    this.shadowRoot.appendChild(template.content);
  }

  init() {
    let searchInput =  null, root = this, inputChange = null;
    searchInput = this.shadowRoot.querySelector('.searchTerm');
    inputChange = this.debounce(() => root.geoCodeAddress(searchInput), 405);
    searchInput.oninput = () => {
      inputChange();
    }
  }

  debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  async geoCodeAddress(searchInput) {
    let geoOutput = null;
    geoOutput = document.querySelector('geocoder-output');
    if (searchInput?.value && searchInput?.value !== "") {
      let url = null, data = null; 
      url = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${config.MAP_KEY}&text=${searchInput?.value}&boundary.country=GB&sources=openstreetmap`;
      data = await this.fetchAndDecode(url, 'text');
      geoOutput?.setAttribute('data', data);
    } else {
      geoOutput?.setAttribute('data', ' ');
    }
  }

  async fetchAndDecode(url, type) {
    let response = null, content = null;  
    response = await fetch(url);
  
    if (!response.ok) {
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
  }
}
customElements.define('geocoder-autocomplete', GeocoderAutocomplete);

export class GeocoderOutputs extends HTMLElement {
  static get observedAttributes() {
    return [ 'data'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.outputElement = this.getAttribute('target');
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = ` 
      <style>
        #address-selection-dropdown {
          position: relative;
          width: 100%;
          z-index: 400;
        }

        @media only screen and (min-width: 728px) {
          #address-selection-dropdown {
            position: absolute;
          }         
        }

        ul {
          padding: 0 10px 0 0;
          margin: 0;
        }

        ul li {
          list-style-type: none;
          color: #ffffff;
          z-index: 9999;
          position: relative;
          padding: 5px;
          cursor: pointer;
          font-size: 12px;
        }

        li:hover {
          background: white;
          color: black;
          mix-blend-mode: screen;
        }
      </style>
      <div id="address-selection-dropdown"></div>`;
    this.shadowRoot.appendChild(template.content);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.renderUpdate(newVal);
    }
  }

  renderUpdate(value) {
    let dropDownSelectBoxes = null, dropDownData = null;
    dropDownSelectBoxes = this.shadowRoot.querySelector('#address-selection-dropdown');
    if (value !== " ") {
      dropDownData = JSON.parse(value);
      this.autoCompleteList(dropDownSelectBoxes, dropDownData?.features);
    } else {
      dropDownSelectBoxes.innerHTML = "";
    }
  }

  autoCompleteList(outPutBox, data) {
    let newUl = null;
    outPutBox.innerHTML = "";
    if (data.length > 0) {
      newUl = document.createElement("ul"); 

      data.forEach(address => {
        let coordinates = null, properties = null, title = null, newLi = null, newContent = null, blackList = null;

        coordinates = address?.geometry?.coordinates;
        properties = address?.properties;

        newLi = document.createElement("li");
        title = properties.label;
        newContent = document.createTextNode(title);
        newLi.setAttribute('data-latitude', coordinates[1]);
        newLi.setAttribute('data-longitude', coordinates[0]);
        blackList = ['accuracy', 'addendum', 'continent_gid', 'country_a', 'county_a', 'country_gid', 'county_gid',
        'gid', 'id', 'locality_gid', 'region_a', 'region_gid', 'source', 'source_id'];
        for(let [key, value] of Object.entries(properties)) {
          if (!blackList.includes(key)) {
            newLi.setAttribute(`data-${key}`, value);
          }
        }
        newLi.appendChild(newContent);
        newUl.appendChild(newLi);
      });

      outPutBox.appendChild(newUl);
      this.addClick(newUl);
    }
  }

  addClick(element) {
    let root = this, nodes = null;
    nodes = element.querySelectorAll('li');
    [...nodes].forEach(node => {
      let search = null, display = null;
      node.addEventListener("click", function () {
        let data = null;
        data = {...node?.dataset};
        if (root.outputElement) {
          display = document.querySelector(root.outputElement);
          display?.setAttribute("search-address", JSON.stringify(data));
        }
        search = document.querySelector("geocoder-autocomplete");
        search?.setAttribute('selected-address', unescape(node.dataset.label));
        element.innerHTML = "";
      })
    })
  }
}
customElements.define('geocoder-output', GeocoderOutputs);