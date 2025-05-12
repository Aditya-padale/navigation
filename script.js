let map = L.map('map').setView([16.9417, 74.4173], 16);

// Tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

// Get user location (no auto center)
let userLocation;
map.locate({ setView: false });

map.on('locationfound', function (e) {
  userLocation = e.latlng;
  L.marker(userLocation).addTo(map).bindPopup("📍 You are here!").openPopup();
});

map.on('locationerror', function () {
  alert("Could not get your location");
});

// Icons based on type
const iconUrls = {
  food: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  hostel: "https://cdn-icons-png.flaticon.com/512/3177/3177361.png",
  library: "https://cdn-icons-png.flaticon.com/512/1946/1946396.png",
  office: "https://cdn-icons-png.flaticon.com/512/1022/1022330.png",
  entrance: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  academic: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
  sports: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
  auditorium: "https://cdn-icons-png.flaticon.com/512/944/944684.png",
  guest: "https://cdn-icons-png.flaticon.com/512/235/235861.png",
  school: "https://cdn-icons-png.flaticon.com/512/4149/4149673.png",
  hospital: "https://cdn-icons-png.flaticon.com/512/2967/2967260.png",
  workshop: "https://cdn-icons-png.flaticon.com/512/1055/1055646.png",
  default: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"
};

// Locations
const locations = [
  { name: "Library", coords: [16.940870288214125, 74.41800437912275], type: "library" },
  { name: "Main Gate", coords: [16.940466, 74.416475], type: "entrance" },
  { name: "Old Boys Hostel", coords: [16.941460475966455, 74.41872227578234], type: "hostel" },
  { name: "New Boys Hostel", coords: [16.941865376282358, 74.41859663944585], type: "hostel" },
  { name: "Sport Complex", coords: [16.942156861708135, 74.41837698725287], type: "sports" },
  { name: "Geust House", coords: [16.942305683994714, 74.41828637185678], type: "guest" },
  { name: "BASIC SCIENCE Department", coords: [16.941152888735715, 74.41853283707293], type: "academic" },
  { name: "BCA BBA Department", coords: [16.941031400425988, 74.4182040356685], type: "academic" },
  { name: "Auditorium Hall", coords: [16.940714964276527, 74.4175962808217], type: "auditorium" },
  { name: "CSE Department(Ground Floor)", coords: [16.940158425190045, 74.41774773784059], type: "academic" },
  { name: "AERONAUTICAL Department(2nd Floor)", coords: [16.940021471757234, 74.41771949988969], type: "academic" },
  { name: "FOOD Department(3rd Floor)", coords: [16.93995622904158, 74.41716150064171], type: "food" },
  { name: "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE Department(4th Floor)", coords: [16.939799392429478, 74.4172446283657], type: "academic" },
  { name: "COE Office", coords: [16.939781042657227, 74.41713267324752], type: "office" },
  { name: "MECHANICAL Department", coords: [16.940450152904592, 74.4177166824822], type: "academic" },
  { name: "ELECTRICAL Department", coords: [16.940189554660172, 74.41719506505673], type: "academic" },
  { name: "IOT & BLOCK CHAIN Department", coords: [16.94039070753685, 74.41751380672439], type: "academic" },
  { name: "ADCBP Pharmacy", coords: [16.939459213450917, 74.41770589907081], type: "academic" },
  { name: "Administrative Wing", coords: [16.940334599401115, 74.41706779630739], type: "office" },
  { name: "ITI Workshop", coords: [16.94094499018545, 74.41893543810346], type: "workshop" },
  { name: "ITI Department", coords: [16.940656137318626, 74.41909200969981], type: "academic" },
  { name: "New Girls Hostel", coords: [16.938941398633613, 74.41792301686827], type: "hostel" },
  { name: "Old Girls Hostel", coords: [16.941419370038403, 74.41620901516109], type: "hostel" },
  { name: "AD Public School", coords: [16.940899960804142, 74.41641565055], type: "school" },
  { name: "ADAMC", coords: [16.94193585069421, 74.41604229445417], type: "hospital" },
  { name: "ADAMC Hospital", coords: [16.942545714693416, 74.41631215593057], type: "hospital" },
  { name: "Ashram Shala", coords: [16.942715392159155, 74.41730344693418], type: "school" },
  { name: "Subhadra International School", coords: [16.938287817283822, 74.41783214236163], type: "school" },
  { name: "WC (WASHROOM)", coords: [16.940090567964074, 74.41693647177298], type: "school" },
  { name: "Cafeteria", coords: [16.939768676124306, 74.41777680266976], type: "food" }
];

// Routing control
let control = null;

// Store all markers
let markers = [];

// Add markers to map
locations.forEach(loc => {
  const iconUrl = iconUrls[loc.type] || iconUrls.default;

  const customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="marker-label">${loc.name}</div>
      <img src="${iconUrl}" class="marker-icon" />
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -45]
  });

  if (loc.coords[0] && loc.coords[1]) {
    const marker = L.marker(loc.coords, { icon: customIcon })
      .addTo(map)
      .bindPopup(`<strong>${loc.name}</strong>`);
    markers.push(marker);
  }
});

// Search function with routing
function searchLocation() {
  const searchText = document.getElementById('searchBox').value.toLowerCase();
  const location = locations.find(loc => loc.name.toLowerCase() === searchText);

  // Remove all markers
  markers.forEach(marker => map.removeLayer(marker));

  // Remove existing route
  if (control) {
    map.removeControl(control);
    control = null;
  }

  if (location && location.coords[0] && location.coords[1]) {
    const iconUrl = iconUrls[location.type] || iconUrls.default;
    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="marker-label">${location.name}</div>
        <img src="${iconUrl}" class="marker-icon" />
      `,
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -45]
    });

    const marker = L.marker(location.coords, { icon: customIcon })
      .addTo(map)
      .bindPopup(`<strong>${location.name}</strong>`)
      .openPopup();

    markers = [marker];
    map.setView(location.coords, 18);
    hideSuggestions();

    if (userLocation) {
      control = L.Routing.control({
        waypoints: [
          L.latLng(userLocation),
          L.latLng(location.coords)
        ],
        routeWhileDragging: false,
        show: false
      }).addTo(map);
    } else {
      alert("User location not found!");
    }
  } else {
    alert("Location not found or missing coordinates!");
  }
}

// Suggestion dropdown logic
function showSuggestions() {
  const searchText = document.getElementById('searchBox').value.toLowerCase();
  const suggestionBox = document.getElementById('suggestions');
  suggestionBox.innerHTML = '';

  if (!searchText) {
    suggestionBox.style.display = 'none';
    return;
  }

  const filtered = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchText)
  );

  if (filtered.length === 0) {
    suggestionBox.style.display = 'none';
    return;
  }

  filtered.forEach(loc => {
    const li = document.createElement('li');
    li.textContent = loc.name;
    li.onclick = function () {
      document.getElementById('searchBox').value = loc.name;
      searchLocation(); // Call main search function
    };
    suggestionBox.appendChild(li);
  });

  suggestionBox.style.display = 'block';
}

function hideSuggestions() {
  const box = document.getElementById('suggestions');
  box.innerHTML = '';
  box.style.display = 'none';
}
