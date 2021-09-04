export class MapDisplay extends HTMLElement {
    static get observedAttributes() {
        return [ 'search-address'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.mapObject = "";
        this.searchAddress = this.getAttribute("search-address");
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal !== newVal) {
          let address = null;
          address = JSON.parse(newVal);
          this.render();
          this.resetMap();
          this.init(address);
        }
    }

    render() { 
        const template = document.createElement("template");
        template.innerHTML = `
        <style>
            #map-content, .map {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
            }
        </style>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossorigin="" />
        <div id="map-content">
            <div id="mapid" class="map"></div>
        </div>`;
        this.shadowRoot.appendChild(template.content);
    }

    init(address) {
        let latitude = null, longitude = null, mapContainer = null, map = null, greenIcon = null, label = null;
        latitude = address.latitude;
        longitude = address.longitude;
        label = address.label;
        mapContainer = this.shadowRoot.querySelector('#mapid');
        map = L.map(mapContainer);

        greenIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        map.setView([latitude, longitude], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([latitude, longitude], {icon: greenIcon})
        .addTo(map)
        .bindPopup(label)
        .openPopup();;
        this.mapObject = map
    }

    resetMap() {
        let container = null, newMapContainer = null;
        container = this.shadowRoot.querySelector('#map-content');
        container.innerHTML = "";
        newMapContainer = document.createElement('div');
        newMapContainer.setAttribute('id', 'mapid');
        newMapContainer.setAttribute('class', 'map');
        container.appendChild(newMapContainer);   
    }
};
customElements.define('map-display', MapDisplay);