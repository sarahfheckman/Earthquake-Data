// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// perfrom a get request to the query URL 
d3.json(queryUrl, function(data) {
  // upon response, send data.features object to the createFeatures fxn
  createFeatures(data.features);
});

// // setting circle color 
// function markerColor(mag) {
//   var mag = feature.properties.mag;
//   if (mag >= 4.0) {
//     return { color: "red" }; 
//   } 
//   else if (mag >= 3.0) {
//     return { color: "orange" };
//   } 
//   else if (mag >= 2.0) {
//     return { color: "yellow" };
//   } 
//   else {
//     return { color: "green" };
//   }
// }

// // setting circle radius
// function markerSize(mag) {
//   return mag * 5
// };

// fxn for popups & styling
function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + 
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // create geojson layer w/features array of earthquake data 
  // onEachFeature fxn 
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    // style: markerColor
  });
  createMap(earthquakes)
}

// creating legend 
// var legend = L.control({ position: "bottomright" });
// legend.onAdd = function() {
//   var div = L.DomUtil.create("div", "info legend");
//   var labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];

function createMap(earthquakes) {

  // copy & paste with no regrets hollaaaa 
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // base layers 
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // map 
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // control layer
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}