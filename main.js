// IP Geolocation API
const API_KEY = 'at_nYZA2E88Gop382wtB9HQCJbz4rg0R';
const searchBtn = document.getElementById('search');
const displayIP = document.getElementById('ip');
const displayLoc = document.getElementById('loc');
const displayTZ = document.getElementById('tz');
const displayISP = document.getElementById('isp')

// Display own user IP on page load (not working due to CORS and proxy)
window.addEventListener('DOMContentLoaded', () => {
    const displayed = `https://cors-anywhere.herokuapp.com/https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress`;
    returnData(displayed);
})

// Search for IP/Domain
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const input = document.getElementById('userInput');
    let searchQuery = input.value.trim().toLowerCase();
    let endpoint = `https://cors-anywhere.herokuapp.com/https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${searchQuery}&domain=${searchQuery}`;

    if(searchQuery === null || searchQuery === undefined || searchQuery === '') {
        console.log('Needs valid input');
    } else returnData(endpoint)
})

// Fetching data
function returnData(get) {
    fetch(get).then((response) => {
        if(!response.ok) {
            throw new Error(`We had a problem with your request ${response.status}`);
        }

        return response.json();
    }).then((data) => {
        displayIP.textContent = data.ip;
        displayLoc.textContent = `${data.location.city}, ${data.location.region}`;
        displayTZ.textContent = `UTC${data.location.timezone}`;
        displayISP.textContent = data.isp
        let lat = data.location.lat;
        let lng = data.location.lng;

        switchView(lat, lng);
    }).catch((error) => console.log(error))
}

// LeafletJS map
function switchView(lat, lng) {
    // Init map
    const map = L.map('map', {
        center: [lat, lng],
        zoom: 15,
    });

    // Check if map is init
    const container = L.DomUtil.get('map');
    if(container !== null) {
        container._leaflet_id = null;
    }

    // Set map view based on coordiantes
    map.setView(new L.LatLng(lat, lng), 15);

    // Create marker icon
    const pinIcon = L.icon({
        iconUrl: './images/icon-location.svg',
        iconSize: [35, 35],
        iconAnchor: [lat, lng]
    })

    // Add marker to map
    const marker = L.marker([lat, lng], {icon: pinIcon}).addTo(map)

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYW5kcmVpYzMwIiwiYSI6ImNsMnJmajFueDA1azczbHBnNWNuamxoemoifQ.lytukgT8b5kLUHTMT6FM0w'
    }).addTo(map);
}