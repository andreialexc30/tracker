// IP Geolocation API
const API_KEY = 'at_nYZA2E88Gop382wtB9HQCJbz4rg0R';
const searchBtn = document.getElementById('search');
const displayIP = document.getElementById('ip');
const displayLoc = document.getElementById('loc');
const displayTZ = document.getElementById('tz');
const displayISP = document.getElementById('isp')

// Display own user IP on page load (not working due to CORS and proxy)
window.addEventListener('DOMContentLoaded', () => {
    const displayed = `https://cors-anywhere.herokuapp.com/https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}&ipAddress`;
    returnData(displayed);
})

// Search for IP/Domain
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const input = document.getElementById('userInput');
    let searchQuery = input.value.trim().toLowerCase();
    let endpoint = `https://cors-anywhere.herokuapp.com/https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}&ipAddress=${searchQuery}&domain=${searchQuery}`;

    returnData(endpoint)
})

function returnData(get) {
    fetch(get).then((response) => {
        if(!response.ok) {
            throw new Error(`We had a problem with your request ${response.status}`);
        }

        return response.json();
    }).then((data) => {
        displayIP.textContent = data.ip;
        displayLoc.textContent = `${data.location.region}, ${data.location.country}`;
        displayTZ.textContent = data.location.timezone;
        displayISP.textContent = data.isp
    }).catch((error) => console.log(error))
}

// LeafletJS map
const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYW5kcmVpYzMwIiwiYSI6ImNsMnJmajFueDA1azczbHBnNWNuamxoemoifQ.lytukgT8b5kLUHTMT6FM0w'
}).addTo(map);