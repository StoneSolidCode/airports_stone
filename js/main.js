var mymap = L.map('map', {
    center: [37.13, -95.93],
    zoom: 5,
    maxZoom: 10,
    minZoom: 4,
    detectRetina: true});

// 2. Add a base map.
L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png').addTo(mymap);

var airports = null;

var colors = chroma.scale('Dark2').mode('lch').colors(9);

for (i = 0; i < 2; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

// Get GeoJSON and put on it on the map when it loads
airports= L.geoJson.ajax("assets/airports.geojson", {
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Airport:  " + feature.properties.AIRPT_NAME + " in " + feature.properties.CITY + ", " + feature.properties.STATE);
    },
    pointToLayer: function (feature, latlng) {
        var icn = "";
        if (feature.properties.CNTL_TWR == 'Y') { icn = "binoculars"; color = 1; }
        else if (feature.properties.CNTL_TWR == 'N')  { icn = "plane"; color = 2; }
        return L.marker(latlng, {icon: L.divIcon({className: 'fa marker-color-'+ color + ' fa-' + icn.toString() })});
    },
    attribution: 'Airport Data &copy; USGS | US States &copy; Mike Bostock of D3 | Base Map &copy; CartoDB | Made By Stone Kaech'
}).addTo(mymap);


colors = chroma.scale('Greens').colors(5);
//
function setColor(density) {
    var id = 0;
    if (density > 20) { id = 4; }
    else if (density > 15 && density <= 20) { id = 3; }
    else if (density > 11 && density <= 15) { id = 2; }
    else if (density > 5 &&  density <= 11) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
    style: style
}).addTo(mymap);

var legend = L.control({position: 'topright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b># Airports</b><br />';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>21+</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>16-20</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>12-14</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 6-11</p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0- 5</p>';
    div.innerHTML += '<hr><b>Cell Tower<b><br />';
    div.innerHTML += '<i class="fa fa-binoculars marker-color-1"></i><p> Airport with Cell Tower</p>';
    div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> Airport</p>';
    return div;
};

legend.addTo(mymap);
L.control.scale({position: 'bottomleft'}).addTo(mymap);
