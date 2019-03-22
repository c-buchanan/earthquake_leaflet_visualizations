// We create the tile layer (background)
console.log("Thank goodness it's finally working!");

var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

// Create the map object with options.
var myMap = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

// Add our 'graymap' tile layer to the map.
graymap.addTo(myMap);

// Retrieve earthquake geoJSON data using an AJAX call 
// Ask Bo to re-explain all this JavaScript stuff 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  // Returns the style data for each of the earthquakes
  // Pass the magnitude of the earthquake into two separate functions to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the magnitude 
  // of the earthquake.
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#472b50";
    case magnitude > 4:
      return "#6a5281";
    case magnitude > 3:
      return "#2fbfb1";
    case magnitude > 2:
      return "#1d6654";
    case magnitude > 1:
      return "#0e4630";
    default:
      return "#cedad5";
    }
  }

  // Create a function that determines the radius of the earthquake marker based
  // on the magnitude. Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // Once the map successfully loads (please load) from the file, add a GeoJSON layer
    L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    // We set the style for each circleMarker
    style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);

  // Create the legend 
  var legend = L.control({
    position: "bottomright"
  });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#cedad5",
      "#0e4630",
      "#1d6654",
      "#2fbfb1",
      "#6a5281",
      "#472b50"
    ];

    // Loop through interals to generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Add a legend so people know what the heck they're looking at. 
  legend.addTo(map);
});
