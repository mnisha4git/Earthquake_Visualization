// Initialize variable with link to Geo json from USGS website
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create the createMap function
d3.json(url, function(data) {
    createMap(data.features);
    });

// Creating map object
function createMap(data) {
    var myMap = L.map("map", {
        center: [37.77, -122.41],
        zoom: 5
    });
    
// Adding tile layer    
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
      }).addTo(myMap);

// Function to create marker with different color based on magnitude of earthquake
    data.forEach(feature => {
        var mag = feature.properties.mag;

        var color = "";
        if (mag <= 1) {
            color = 'green';
        }
        else if (mag <= 2) {
            color = "yellow"; 
        }
        else if (mag <= 3) {
            color = "#ffb787";
        }
        else if (mag <= 4) {
            color = "#fd6500";
        }
        else if (mag <= 5) {
            color = "#FF0000"; 
        }
        else {
            color = "#800000"; 
        }

    // Change size of marker based on magnitude of earthquake 
        L.circle([feature.geometry.coordinates[1],
                 feature.geometry.coordinates[0]], {
                    fillColor: color,
                    fillOpacity: 0.75,
                    color: color,
                    radius: mag * 10000
                 }).bindPopup("<h3> Location: " + feature.properties.place + "<hr>Mag: " + mag + "</h3>").addTo(myMap);
    });
    
    // Create legend to reflect magnitue of earthquake 
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var colors = ["green", "yellow", "#ffb787",
                        "#fd6500", "#FF0000", "#800000"];
    
        // loop through density intervals and generate a label with a colored background for each interval
        for (var i = 0; i < colors.length; i++) {
            div.innerHTML +=
                '<li style="background-color:' + colors[i] + '">' + labels[i] + '</li>';
            }
        return div;
    }
    legend.addTo(myMap);
}
