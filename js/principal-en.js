/* MAP --- Add base cartographic elements
  - Initialize the map and set its view
  - Tile layer
  - MiniMap
  - Zoom control
  - Fullscreen control */

// Initialize the map and set its view to geographical limits of Spain (include Canary Islands)
var map = L.map('map', {
    zoomControl: false,
    maxZoom: 18,
    minZoom: 0,
  }).setView([41.5, 2.5], 5.25);

// Add a tile layer to the map (Mapbox Streets tile layer)
var mapboxToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={token}';
var mapboxAttribution = [
  'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,',
  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,',
  'Imagery © <a href="http://mapbox.com">Mapbox</a>',
].join(" ");

var mapbox = L.tileLayer(mapboxUrl, {
    id: 'mapbox.streets',
    token: mapboxToken,
    attribution: mapboxAttribution,
  }).addTo(map);

// Add a zoom control to the map
new L.Control.Zoom({position: 'topleft'}).addTo(map);

// Add MiniMap to the map (plugin)
var osm2 = new L.TileLayer(mapboxUrl, {
  id: 'mapbox.streets',
  token: mapboxToken,
  attribution: mapboxAttribution,
  minZoom: 0,
  maxZoom: 13,
});

var miniMap = new L.Control.MiniMap(osm2, {toggleDisplay: true, position: 'bottomright'}).addTo(map);

// Add a fullscreen control to the map (plugin)
map.addControl(new L.Control.Fullscreen());

// Add a scale
L.control.scale({maxWidth: 200, metric: true, imperial: false, position: 'bottomright'}).addTo(map);


/* PAGE STYLE
    - Tabs
    - Remove preloader */

// Create functional tabs
$(document).ready(function() {

	//When page loads
	$(".tab_content").hide();                            //Hide all content
	$("ul.tabs li:first").addClass("active").show();     //Activate first tab
	$(".tab_content:first").show();                      //Show first tab content

	//On Click Event
	$("ul.tabs li").click(function() {

		$("ul.tabs li").removeClass("active");              //Remove any "active" class
		$(this).addClass("active");                         //Add "active" class to selected tab
		$(".tab_content").hide();                           //Hide all tab content

		var activeTab = $(this).find("a").attr("href");     //Find the href attribute value to identify the active tab + content
		$(activeTab).fadeIn();                              //Fade in the active ID content
		return false;
	});
});

// Remove preloader when window is loaded
function removePreloader() {
  var preloader = document.querySelector("#preloader-container");
  preloader.style.opacity = 0;
  setTimeout(function() { preloader.remove() }, 250);
}

window.addEventListener('load', removePreloader);




/* DATA --- Extract xlsx path and row information from the form
  - Show/hide dropdowns
  - Capture form elements
  - Validate form
  - Extract xlsx path and row

*/


// MAP --- Show/hide geographical unit options based on rare disease select
var selectDisease = document.querySelector("select#rare-disease");
selectDisease.addEventListener("change", function(ev) {

  //If RD diferent from "ataxy", "huntington" or "neuron" remove country option
  if (selectDisease.value != "ataxy" || selectDisease.value != "huntington" || selectDisease.value != "neuron") {

    var countryExists = ($('#geoMap option[value=country]').length > 0);
    if (countryExists) {
      $("#geoMap option[value='country']").remove();

    }

  }

  /*if (selectDisease.value === "ataxy" || selectDisease.value === "huntington" || selectDisease.value === "neuron") {
    var countryExists = ($('#geoMap option[value=country]').length > 0);

    if (!countryExists) {
      $('#geoMap').append($('<option>', { value: "country", text: 'Country'}));

    }

  }*/

  if (selectDisease.value === "ataxy") {
    var privinceExists = ($('#geoMap option[value=province]').length > 0);
    var districtExists = ($('#geoMap option[value=district]').length > 0);

    if (privinceExists) {
      $("#geoMap option[value='province']").remove();

    }

    if (districtExists) {
     $("#geoMap option[value='district']").remove();

   }

  }

});


// MAP ---  Show/hide indicator select options based on geographical unit
const selectGeoUnit = document.querySelector("select#geoMap");
selectGeoUnit.addEventListener("change", function(ev) {
  // only rme and ta indicator
  if (selectGeoUnit.value === "country") {

    // remove pps if exists
    let ppsExists = ($('#rate option[value=pps]').length > 0);
    if (ppsExists) {
    $("#rate option[value='pps']").remove();

    }

    // remove rrs if exists
    let rrsExists = ($('#rate option[value=rrs]').length > 0);
    if (ppsExists) {
    $("#rate option[value='rrs']").remove();

    }

    // add ta if not exists
    let taExists = ($('#rate option[value=ta]').length > 0);
    if (!taExists) {
      $('#rate').append($('<option>', { value: "ta", text: 'Age-adjusted Mortality Rate'}));

    }

  };

  // only rme indicator
  if (selectGeoUnit.value === "province") {

    // remove pps if exists
    let ppsExists = ($('#rate option[value=pps]').length > 0);
    if (ppsExists) {
    $("#rate option[value='pps']").remove();

    }

    // remove rrs if exists
    let rrsExists = ($('#rate option[value=rrs]').length > 0);
    if (ppsExists) {
    $("#rate option[value='rrs']").remove();

    }

    // remove ta if exists
    let taExists = ($('#rate option[value=ta]').length > 0);
    if (taExists) {
      $("#rate option[value='ta']").remove();

    }

    $('#rate option[value="rme"]').attr("selected", true);
  }

  // only pps, rrs y rme indicator (NO TA)
  if (selectGeoUnit.value === "district") {

    // add pps if not exists
    let ppsExists = ($('#rate option[value=pps]').length > 0);
    if (!ppsExists) {
      $('#rate :nth-child(2)').after("<option value='pps'>Posterior Probability</option>");

    }

    // add rrs if not exists
    let rrsExists = ($('#rate option[value=rrs]').length > 0);
    if (!rrsExists) {
      $('#rate :nth-child(2)').after("<option value='rrs'>Smoothed Standardized Mortality Ratio</option>");

    }

    // add rme if not exists
    let rmeExists = ($('#rate option[value=rme]').length > 0);
    if (!rmeExists) {
      $('#rate').append($('<option>', { value: "rme", text: 'Standardized Mortality Ratio'}));


    }

    // remove ta if exists
    let taExists = ($('#rate option[value=ta]').length > 0);
    if (taExists) {
      $("#rate option[value='ta']").remove();

    }

  };

});


// MAP ---  Show/hide sex select options based on indicator
const selectRate = document.querySelector("select#rate");
selectRate.addEventListener("change", function(ev) {
  // only rme and ta indicator
  if (selectRate.value === "ta") {

    // remove women if exists
    let womenExists = ($('#sex option[value=women]').length > 0);
    if (womenExists) {
    $("#sex option[value='women']").remove();

    }

    // remove men if exists
    let menExists = ($('#sex option[value=men]').length > 0);
    if (menExists) {
    $("#sex option[value='men']").remove();

    }


  } else {
    // add women if not exists
    let womenExists = ($('#sex option[value=women]').length > 0);
    if (!womenExists) {
      $('#sex').append($('<option>', { value: "women", text: 'Women'}));

    }

    // add men if not exists
    let menExists = ($('#sex option[value=men]').length > 0);
    if (!menExists) {
      $('#sex').append($('<option>', { value: "men", text: 'Men'}));

    }

  }

});


// TREND --- Show/hide country options based on rare disease select
const selectTrendDisease = document.querySelector("select#rare-disease-trend");
selectTrendDisease.addEventListener("change", function(ev) {


  // Countries with huntington
  const huntingtonCountries = [ ["austria", "Austria"],
                            ["belgium", "Belgium"],
                            ["croatia", "Croatia"],
                            ["czechia", "Czechia"],
                            ["denmark", "Denmark"],
                            ["finland", "Finland"],
                            ["france", "France"],
                            ["germany", "Germany"],
                            ["hungary", "Hungary"],
                            ["lithuania", "Lithuania"],
                            ["luxembourg", "Luxembourg"],
                            ["netherlands", "Netherlands Bajos"],
                            ["norway", "Norway"],
                            ["poland", "Poland"],
                            ["romania", "Romania"],
                            ["sweden", "Sweden"],
                            ["switzerland", "Switzerland"],
                            ["unitedkingdom", "United Kingdom"],
                            ["malta" , "Malta"],
                            ["bulgaria", "Bulgaria"],
                            ["cyprus", "Cyprus"],
                            ["estonia", "Estonia"],
                            ["iceland", "Iceland"],
                            ["ireland", "Ireland"],
                            ["italy", "Italy"],
                            ["latvia", "Latvia"],
                            ["moldova", "Moldova"],
                            ["portugal", "Portugal"],
                            ["serbia", "Serbia"],
                            ["slovakia", "Slovakia"],
                            ["slovenia", "Slovenia"]
                          ];


  const ataxyCountries = [ ["austria", "Austria"],
                            ["belgium", "Belgium"],
                            ["croatia", "Croatia"],
                            ["czechia", "Czechia"],
                            ["denmark", "Denmark"],
                            ["finland", "Finland"],
                            ["france", "France"],
                            ["germany", "Germany"],
                            ["hungary", "Hungary"],
                            ["lithuania", "Lithuania"],
                            ["luxembourg", "Luxembourg"],
                            ["netherlands", "Netherlands Bajos"],
                            ["norway", "Norway"],
                            ["poland", "Poland"],
                            ["romania", "Romania"],
                            ["sweden", "Sweden"],
                            ["switzerland", "Switzerland"],
                            ["unitedkingdom", "United Kingdom"],
                          ];

  const noAtaxyCountries = ["malta", "bulgaria", "cyprus", "estonia", "iceland", "ireland", "italy", "latvia", "moldova", "portugal", "serbia", "slovakia", "slovenia"];
  const noNeuronCountries = ["bulgaria", "cyprus", "estonia", "iceland", "ireland", "italy", "latvia", "moldova", "portugal", "serbia", "slovakia", "slovenia"];



  if (selectTrendDisease.value === "huntington") {

    for (let elm in huntingtonCountries) {

      let exists = ($('#geoTrend option[value=' + huntingtonCountries[elm][0] +']').length > 0);
      if (!exists) {
        $('#geoTrend').append($('<option>', { value: huntingtonCountries[elm][0], text: huntingtonCountries[elm][1]}));

      }

    }


  } else if (selectTrendDisease.value === "ataxy") {

    for (let elm in noAtaxyCountries) {

      let exists = ($('#geoTrend option[value=' + noAtaxyCountries[elm] +']').length > 0);
      if (exists) {
        $('#geoTrend option[value=' + noAtaxyCountries[elm] +']').remove();

      }

    }

    for (let elm in ataxyCountries) {

      let exists = ($('#geoTrend option[value=' + ataxyCountries[elm][0] +']').length > 0);
      if (!exists) {
        $('#geoTrend').append($('<option>', { value: ataxyCountries[elm][0], text: ataxyCountries[elm][1]}));

      }

    }


  } else if (selectTrendDisease.value === "neuron") {

    for (let elm in noNeuronCountries) {

      let exists = ($('#geoTrend option[value=' + noNeuronCountries[elm] +']').length > 0);
      if (exists) {
        $('#geoTrend option[value=' + noNeuronCountries[elm] +']').remove();

      }

    }

    let maltaExists = ($('#geoTrend option[value=malta]').length > 0);
    if (!maltaExists) {
      $('#geoTrend').append($('<option>', { value: "malta", text: "Malta"}));

    }

  } else {

    $('#geoTrend option[value="spain"]').attr("selected", true);

    for (let elm in huntingtonCountries) {

      let exists = ($('#geoTrend option[value=' + huntingtonCountries[Number(elm)][0] +']').length > 0);
      if (exists) {
        $('#geoTrend option[value=' + huntingtonCountries[elm][0] +']').remove();

      }

    }

    let spainExists = ($('#geoTrend option[value=spain]').length > 0);
    if (!spainExists) {
      $('#geoTrend').append($('<option>', { value: "spain", text: 'Spain'}));

    }

  };

});


// Capture and serialize form elements
function serializeMapFormValues() {
  var category = document.querySelector("select#rare-disease").value;
  var geo = document.querySelector("select#geoMap").value;
  var rate = document.querySelector("select#rate").value;
  var sex = document.querySelector("select#sex").value;

  return {
    category: category,
    geo: geo,
    rate: rate,
    sex: sex,
  }
};

function validateMapForm () {
  let formElements = serializeMapFormValues();

  if (!formElements.category) {
    msg("error", "Please, select a Rare disease.")

  } else if (!formElements.geo) {
    msg("error", "Please, select a Geographical unit.")

  } else if (!formElements.rate) {
    msg("error", "Please, select an  Epidemiological indicator.")

  } else if (!formElements.sex) {
    msg("error", "Please, select a sex.")

  } else {
  };
}

function serializeTrendFormValues() {
  var geo = document.querySelector("select#geoTrend").value;
  var category = document.querySelector("select#rare-disease-trend").value;
  var from = document.querySelector("select#period-from").value;
  var to = document.querySelector("select#period-to").value;


  return {
    geo: geo,
    category: category,
    from: from,
    to: to,
  }
};

function validateTrendForm () {
  let formElements = serializeTrendFormValues();

  if (!formElements.category) {
    msg("error", "Please, select a rare disease.")

  } else if (!formElements.geo) {
    msg("error", "Please, select a country.")

  } else {
  };
}

/* MAP --- Features style
  - Highlight features on mouseover
  - Zoom to on click
  - Information control listener
  - Color classification based on rate (ADD TO MAP)
  - Map configuration
  */

function polystyleDefault(layer) {
    return {
      fillColor: '#000099',
      weight: 2,
      opacity: 0.25,
      color: '#000099',
      fillOpacity: 00
    };
}

function addMouseListenerToFeature(feature, layer) {
  layer.on({

    // Highlight features on mouseover configuration
    mouseover: function highlightPolygon(e) {
      e.target.setStyle({
        weight: 5,
        fillOpacity: 1,
      });
    },
    mouseout: function revertHighlightPolygon(e) {
      e.target.setStyle({
        weight: 2,
        fillOpacity: 1,
      });
    },

    //Zoom to on click configuration
    click: function zoomToPolygon(ev) {
      ev.target._map.fitBounds(ev.target.getBounds());
    }
  });

  // Info Control configuration
  layer.on("mouseover", function() {
    var comar = layer.feature.properties.NOM_COMAR || layer.feature.properties.Texto || layer.feature.properties.Country
    var rate =  layer.feature.properties.rate;
    infoLegend.update(comar, rate);
  })
  layer.on("mouseout", function() {
    infoLegend.reset();
  });

};

function transparentStyle () {
  return {
    "color": "#f2f2f2",
    "fillOpacity": 0.99
  }
}


let lastAddeddLayer = null;
function addRateDataLayer(layer) {
  // Color classification for features based on rate
  const colorByRate = function(rateType, rateValue) {
    if (rateType === "rrs") {
      return rateValue > 90   ? 'transparent' :
             rateValue > 1.80 ? '#d73027' :
      			 rateValue > 1.40 ? '#fc8d59' :
      			 rateValue > 1.10 ? '#fee08b' :
      			 rateValue > 0.90 ? '#ffffbf' :
      			 rateValue > 0.70 ? '#d9ef8b' :
      			 rateValue > 0.50 ? '#91cf60' :
      			 '#1a9850';
    } else if (rateType === "rme") {
      return rateValue > 90   ? 'transparent' :
             rateValue > 1.35 ? '#d73027' :
      			 rateValue > 1.20 ? '#fc8d59' :
      			 rateValue > 1.05 ? '#fee08b' :
      			 rateValue > 0.95 ? '#ffffbf' :
      			 rateValue > 0.80 ? '#d9ef8b' :
      			 rateValue > 0.60 ? '#91cf60' :
      			 '#1a9850';
    } else if (rateType === "pps") {
      return rateValue > 90   ? 'transparent' :
             rateValue > 0.90 ? '#d64700' :
             rateValue > 0.80 ? '#ffaa00' :
             rateValue > 0.20 ? '#ffffbf' :
             rateValue > 0.10 ? '#66c763' :
            '#1a9850';
    } else if (rateType === "ta") {
      if (document.querySelector("select#rare-disease").value === "huntington") {
        return rateValue > 90 ? '#b3b3b3' :
               rateValue > 0.32 ? '#993404' :
               rateValue > 0.16 ? '#d95f0e' :
               rateValue > 0.11 ? '#fe9929' :
               rateValue > 0.04 ? '#fed98e' :
               '#ffffd4';


      } else if (document.querySelector("select#rare-disease").value === "neuron") {
        return rateValue > 90 ? '#b3b3b3' :
               rateValue > 1.9 ? '#993404' :
               rateValue > 1.59 ? '#d95f0e' :
               rateValue > 1.35 ? '#fe9929' :
               rateValue > 0.8 ? '#fed98e' :
               '#ffffd4';

      } else if (document.querySelector("select#rare-disease").value === "ataxy") {
        return rateValue > 90 ? '#b3b3b3' :
               rateValue > 0.08 ? '#993404' :
               rateValue > 0.07 ? '#d95f0e' :
               rateValue > 0.05 ? '#fe9929' :
               rateValue > 0.018 ? '#fed98e' :
               '#ffffd4';

      } else {
        return rateValue > 90   ? 'transparent' :
               rateValue > 0.90 ? '#d64700' :
               rateValue > 0.80 ? '#ffaa00' :
               rateValue > 0.20 ? '#ffffbf' :
               rateValue > 0.10 ? '#66c763' :
              '#1a9850';
      }

    } else {
      return '#000000';
      throw new Error("No rate found for name " + rateType);
    }
  }


  // Features style configuration
  const polystyle = function(feature) {
    const rateType = serializeMapFormValues().rate;
    return {
      fillColor: colorByRate(rateType, feature.properties.rate),
      weight: 1.25,
      opacity: 0.25,
      color: '#000000',
      fillOpacity: 1,
    };
  };

  // Features configuration
  lastAddeddLayer && map.removeLayer(lastAddeddLayer);
  lastAddeddLayer = L.geoJson(layer, {
    style: polystyle,
    onEachFeature: function(feature, layer) {
      addMouseListenerToFeature(feature, layer);
    }

  // ADD LAYER with style to map
  }).addTo(map);
}


/* MAP --- Control Layers
  Add provinces and states  with control layers */

var ccaaDefault = L.geoJson(LAYER_CCAA, {style: polystyleDefault});
var provDefault = L.geoJson(LAYER_PROVINCIAS, {style: polystyleDefault});

var baseLayers = {
    "Base OSM": mapbox,
};

var overlayers = {
  "Comunidades Autónomas": ccaaDefault,
  "Provincias": provDefault,
};

L.control.layers(baseLayers, overlayers,{collapsed:true, position: "topleft"}).addTo(map);

map.on("overlayadd", function (event) {
  ccaaDefault.bringToFront();
});


/* DATA --- Add the corresponding rate to the shp using the common ID field
  - Asign tuples [ID, rate] to the shp
  - Load layer with rate information (color already classified) */


// Merge tuples with rate data into the layer (in memory, not shp alteration)
function mergeTuplesIntoLayer(layer, tuples) {
  const tuplesById = tuples.reduce(function(v, tuple) {
    const newValue = {};
    newValue[tuple[0]] = tuple[1];
    return Object.assign(v, newValue);
  }, {});
  layer.features.forEach(function(feature) {
    const propertyId = Object.keys(feature.properties).shift();
    const id = feature.properties[propertyId];
    feature.properties.rate = tuplesById[id] || 0;
  })
}

// Load layer with rate information (data and color)
function onMapDataReady(tuples) {
  const form = serializeMapFormValues();
  const layersByName = {
    district: LAYER_COMARCAS,
    province: LAYER_PROVINCIAS,
    country: LAYER_PAISES,
  };
  const layer = layersByName[form.geo];
  if (!layer) {
    throw new Error("No layer found for name " + form.geo);
  }
  mergeTuplesIntoLayer(layer, tuples);
  addRateDataLayer(layer);
}


/* MAP --- Legend control
  - Color classification based on rate
  - Legend configuration */

// Legend color classification based on PPs rate
function getColorPPs(rateValue) {
  return rateValue > 90 ? '#b3b3b3' :
         rateValue > 0.9 ? '#d64700' :
         rateValue > 0.8 ? '#ffaa00' :
         rateValue > 0.2 ? '#ffffbf' :
         rateValue > 0.1 ? '#66c763' :
         '#1a9850';
}

// PPs legend configuration
var legendPPs = L.control({position: 'bottomleft'});
legendPPs.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 0.10, 0.20, 0.80, 0.90, 90],
      labels = [ "< 0.1", "0.1 - 0.2", "0.2 - 0.8", "0.8 - 0.9", " > 0.9"];

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColorPPs(grades[i+1]) + '"></i> ' +
    labels[i] + '<br>';
  }
  return div;
}

// Legend color classification based on RME rate
function getColorRME(rateValue) {
  return rateValue > 90 ? '#b3b3b3' :
         rateValue > 1.35 ? '#d73027' :
         rateValue > 1.20 ? '#fc8d59' :
         rateValue > 1.05 ? '#fee08b' :
         rateValue > 0.95 ? '#ffffbf' :
         rateValue > 0.80 ? '#d9ef8b' :
         rateValue > 0.60 ? '#91cf60' :
         '#1a9850';

}

// RME legend configuration
var legendRME = L.control({position: 'bottomleft'});
legendRME.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 0.6, 0.8, 0.95, 1.05, 1.2, 1.35, 90],
      labels = [" < 0.6", "0.6 - 0.8", "0.8 - 0.95", "0.95 - 1.05", "1.05 - 1.2", "1.2 - 1.35", " > 1.35"];

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColorRME(grades[i+1]) + '"></i> ' +
    labels[i] + '<br>';
  }
  return div;
}


// Legend color classification based on RRs rate
function getColorRRs(rateValue) {
  return rateValue > 90 ? '#b3b3b3' :
         rateValue > 1.80 ? '#d73027' :
         rateValue > 1.40  ? '#fc8d59' :
         rateValue > 1.10  ? '#fee08b' :
         rateValue > 0.90   ? '#ffffbf' :
         rateValue > 0.70   ? '#d9ef8b' :
         rateValue > 0.50   ? '#91cf60' :
         '#1a9850';
}

// RRs legend configuration
var legendRRs = L.control({position: 'bottomleft'});
legendRRs.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 0.5, 0.7, 0.9, 1.1, 1.4, 1.8, 90],
      labels = [" < 0.5", "0.5 - 0.7", "0.7 - 0.9", "0.9 - 1.15", "1.1 - 1.4", "1.4 - 1.8", " > 1.8"];

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColorRRs(grades[i+1]) + '"></i> ' +
    labels[i] + '<br>';
  }
  return div;
}


// Legend color classification based on TA rate
function getColorTaHuntington(rateValue) {
  return rateValue > 90 ? '#b3b3b3' :
         rateValue > 0.32 ? '#993404' :
         rateValue > 0.16 ? '#d95f0e' :
         rateValue > 0.11 ? '#fe9929' :
         rateValue > 0.04 ? '#fed98e' :
         '#ffffd4';
}

// TA Huntington legend configuration
var legendTaHuntington = L.control({position: 'bottomleft'});
legendTaHuntington.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 0.04, 0.11, 0.16, 0.32, 90],
      labels = [" < 0.04", "0.04 - 0.11", "0.11 - 0.16", "0.16 - 0.32", " > 0.32"];

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColorTaHuntington(grades[i+1]) + '"></i> ' +
    labels[i] + '<br>';
  }
  return div;
}

function getColorTaNeuron(rateValue) {
  return rateValue > 90 ? '#b3b3b3' :
         rateValue > 1.9 ? '#993404' :
         rateValue > 1.59 ? '#d95f0e' :
         rateValue > 1.35 ? '#fe9929' :
         rateValue > 0.8 ? '#fed98e' :
         '#ffffd4';
}

// TA Neuron legend configuration
var legendTaNeuron = L.control({position: 'bottomleft'});
legendTaNeuron.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 0.8, 1.35, 1.59, 1.9, 90],
      labels = [" < 0.8", "0.8 - 1.35", "1.35 - 1.59", "1.59 - 1.9", " > 1.9"];

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColorTaNeuron(grades[i+1]) + '"></i> ' +
    labels[i] + '<br>';
  }
  return div;
}

function getColorTaAtaxy(rateValue) {
  return rateValue > 90 ? '#b3b3b3' :
         rateValue > 0.08 ? '#993404' :
         rateValue > 0.07 ? '#d95f0e' :
         rateValue > 0.05 ? '#fe9929' :
         rateValue > 0.018 ? '#fed98e' :
         '#ffffd4';
}

// TA Ataxy legend configuration
var legendTaAtaxy = L.control({position: 'bottomleft'});
legendTaAtaxy.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 0.018, 0.05, 0.07, 0.08, 90],
      labels = [" < 0.018", "0.018 - 0.05", "0.05 - 0.07", "0.07 - 0.08", " > 0.08"];

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColorTaAtaxy(grades[i+1]) + '"></i> ' +
    labels[i] + '<br>';
  }
  return div;
}

/* NUEVA LEYENDA
function getColorTaDisease(rateValue) {
  return rateValue > 90 ? '#b3b3b3' :
         rateValue > 0.08 ? '#993404' :
         rateValue > 0.07 ? '#d95f0e' :
         rateValue > 0.05 ? '#fe9929' :
         rateValue > 0.018 ? '#fed98e' :
         '#ffffd4';
}

// TA Disease legend configuration
var legendTaDisease = L.control({position: 'bottomleft'});
legendTaDisease.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 0.10, 0.20, 0.80, 0.90, 90],
      labels = [" < 0.018", "0.018 - 0.05", "0.05 - 0.07", "0.07 - 0.08", " > 0.08"];

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColorTaDisease(grades[i+1]) + '"></i> ' +
    labels[i] + '<br>';
  }
  return div;
} */



/* MAP --- Information control configuration*/

// Legend control
function createInfoControl() {
  let info = L.control();

  info.onAdd = function() {
    this._container = L.DomUtil.create('div', 'info info-control');
    this._titleRate = L.DomUtil.create('h4');
    this._title = L.DomUtil.create('h4');
    this._rate = L.DomUtil.create('div');
    this._container.appendChild(this._titleRate);
    this._container.appendChild(this._title);
    this._container.appendChild(this._rate);
    this.reset();
    return this._container;
  }
  info.reset = function() {
    let mapValues = serializeMapFormValues();
    this._titleRate.innerText = $( "#rare-disease option:selected" ).text();
    this._title.innerText = "";
    this._rate.innerText = "Pase el cursor por encima";
  }
  info.update = function(title, rate) {
    this._title.innerText = title;
    this._rate.innerText = rate.toFixed(2);
	};
  return info;
}

var infoLegend = createInfoControl();



/* CHART ---
  - Chart configuration
  - Read the corresponding xlsx file in each case
  - Update chart with rate data from xlsx files
  - Update chart configuration
  - Load chart to div */

// Chart configuration
var fv = serializeTrendFormValues();

document.getElementById('chart-canvas').getContext('2d').fillStyle = "white";
document.getElementById('download_link').href = "javascript: void(0)";
var backgroundColor = 'white';
//var url_base64 = '';
Chart.plugins.register({
    beforeDraw: function(c) {
        var ctx = c.chart.ctx;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, c.chart.width, c.chart.height);
    }
});

var chart = new Chart(document.getElementById('chart-canvas').getContext('2d'), {
  type: 'line',
  scaleFontColor: 'red',
  options: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true
      }
    },
		responsive: true,
		title: {
			display: true,
			text: '',
      fontSize: 14,
      padding: 45
		},
		tooltips: {
			mode: 'index',
			intersect: false
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
      fontColor: "#ff0000",
			xAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Instituto de Investigación de Enfermedades Raras - Instituto de Salud Carlos III',
          fontSize: 10
				},
        ticks: {
          beginAtZero: false,
          min: 0,
          suggestedMin: 0
        },
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Age-adjusted Mortality Rate per 100,000 inhabitants',
          fontStyle: "bold",
          fontSize: 12,
				},
        ticks: {
          beginAtZero: true,
          min: 0,
          suggestedMin: 0
        },
			}]
		},
    animation : {
        onComplete : done
    }
	}
});

function done(){
	var url_base64 = document.getElementById('chart-canvas').toDataURL('image/jpeg');
	document.getElementById('download_link').href = url_base64;
};

//Update chart with rate data from xlsx files
function updateChartWithXlsxData(xlsxData) {
  const getRowValueByNameOrPosition = function(name, position) {
    return function(row) {
      const keys = Object.keys(row)
      const rowNameByName = keys.map((k) => k.toLowerCase()).find((k) => k == name)
      const rowNameByPosition = keys[position];
      return row[rowNameByName] || row[rowNameByPosition] || null;
    }
  }
  const labelsX = xlsxData.map(getRowValueByNameOrPosition("año", 0));
  const datasetBothData = xlsxData.map(getRowValueByNameOrPosition("ta_total", 1));
  const datasetMenData = xlsxData.map(getRowValueByNameOrPosition("ta_men", 2));
  const datasetWomenData = xlsxData.map(getRowValueByNameOrPosition("ta_women", 3));
  updateChart(labelsX, [
    {
      label: "Total",
      data: datasetBothData,
      borderColor: "#e9a917",
      backgroundColor: "transparent",
      spanGaps: true,
      pointStyle: 'line'
    },
    {
      label: "Men",
      data: datasetMenData,
      borderColor: "#76a892",
      backgroundColor: "transparent",
      spanGaps: true,
      pointStyle: 'line'
    },
    {
      label: "Women",
      data: datasetWomenData,
      borderColor: "#ed422d",
      backgroundColor: "transparent",
      spanGaps: true,
      pointStyle: 'line'
    },
  ]);
}

// Update chart configuration
function updateChart(labelsX, datasets) {
  chart.data.labels = labelsX;
  chart.data.datasets = datasets;
  chart.update();
}

function filterChartDataByYearRange(data, yearStart, yearEnd) {
  return data.filter(function isInYearRange(d) {
    const from = Number(yearStart);
    const to = Number(yearEnd);
    const y = Number(d["Año"]);
    return y >= from && y <= to;
  });
}

/* Add event listener to submit button
  - Update map
  - Update legend
  - Add info control
  - Update chart */



// Visualize map information
var mapSubmitButton = document.querySelector("input[name=map-submit]");
var currentLegend = L.control();                                                // Need to preserve the object to use later when you remove it
mapSubmitButton.addEventListener("click", function(ev) {
  ev.preventDefault();
  const validateMapFormSubmit = validateMapForm();
  const addPeriodInfo = addPeriodInfoToDom();
  const mapForm = serializeMapFormValues();
  const dataSheetRowName = mapForm.rate + "_" + mapForm.sex;
  const dataSheetCallback = function(error, dataSheet) {
    if (error) {
      return console.error(error);
    }
    var tuples = dataSheet.map(function(row) {
      const rowName = Object.keys(row).find(function(k) {
        return k.toLowerCase() === dataSheetRowName;
      });
      return [row.ID, row[rowName]];
    });
    onMapDataReady(tuples);
  }

  const geoUnit = mapForm.geo;
  const disease = mapForm.category;
  if (disease === "total") {
    DataService.getGeoAllDiseaseDataByGeoUnit(geoUnit, dataSheetCallback);
  } else {
    DataService.getGeoDiseaseDataByGeoUnit(disease, geoUnit, dataSheetCallback);
  }

  // Update legend base on rateType
  if (mapForm.rate === "pps") {
    map.removeControl(currentLegend);
    currentLegend = legendPPs;
    currentLegend.addTo(map);
  } else if (mapForm.rate === "rme") {
    map.removeControl(currentLegend);
    currentLegend = legendRME;
    currentLegend.addTo(map);
  } else if (mapForm.rate === "rrs") {
    map.removeControl(currentLegend);
    currentLegend = legendRRs;
    currentLegend.addTo(map);

  } else if (mapForm.rate === "ta") {
    if (mapForm.category === "huntington") {
      map.removeControl(currentLegend);
      currentLegend = legendTaHuntington;
      currentLegend.addTo(map);

    } else if (mapForm.category === "neuron") {
      map.removeControl(currentLegend);
      currentLegend = legendTaNeuron;
      currentLegend.addTo(map);

    } else if (mapForm.category === "ataxy") {
      map.removeControl(currentLegend);
      currentLegend = legendTaAtaxy;
      currentLegend.addTo(map);

    } /* else if (mapForm.category === "diseaseName") {
      map.removeControl(currentLegend);
      currentLegend = legendTaDisease;
      currentLegend.addTo(map);

    } */

  } else {
    console.log("No rate")
  }

  // Add info control legend
  infoLegend.addTo(map);

});

// Visualize trend information
var trendSubmitButton = document.querySelector("input[name=trend-submit]");
trendSubmitButton.addEventListener("click", function(ev) {
  ev.preventDefault();
//  const validateTrendFormSubmit = validateTrendForm();
  const trendForm = serializeTrendFormValues();
  const dataSheetCallback = function(error, dataSheet) {
    if (error) {
      return console.error(error);
    }
    dataSheet = filterChartDataByYearRange(dataSheet, trendForm.from, trendForm.to);
    updateChartWithXlsxData(dataSheet);
  }

  const disease = trendForm.category;
  const country = trendForm.geo;
  if (disease === "total") {
    DataService.getTrendAllDiseaseDataByCountry(country, dataSheetCallback);
  } else {
    DataService.getTrendDiseaseDataByCountry(disease, country, dataSheetCallback);
  }

  chart.options.title.text = $( "#rare-disease-trend option:selected" ).text() + " (" + $( "#geoTrend option:selected" ).text() + ")";
  chart.update();
});

/* Alert error system */
function msg(arg1, arg2, arg3 = 4){
    var alerta = document.getElementById('alert');

    alerta.setAttribute('data-tipo', arg1);
    alerta.textContent = arg2;
    alerta.classList.add('active');

    setTimeout(function(){

        alerta.classList.remove('active');

    }, arg3 * 1000);
};


/* Info period */
function addPeriodInfoToDom () {
  const periodValues = serializeMapFormValues();

  if (periodValues.category === "huntington") {
    if (periodValues.geo === "country") {
      document.getElementById('period-info').innerHTML = '*Data period:<br>&nbsp;&nbsp;&nbsp;Austria: 2002 - 2013<br>&nbsp;&nbsp;&nbsp;Remainder: 2001 - 2012';

    } else if (periodValues.geo === "province" || periodValues.geo === "district") {
      document.getElementById('period-info').innerHTML = '*Data period: 1999 - 2013';

    } else {
      document.getElementById('period-info').innerHTML = '*Data period:';

    }
  } else if (periodValues.category === "neuron") {
    if (periodValues.geo === "country") {
      document.getElementById('period-info').innerHTML = '*Data period: <br>&nbsp;&nbsp;&nbsp;Austria: 2002 - 2014<br>&nbsp;&nbsp;&nbsp;Denmark: 2000 - 2012<br>&nbsp;&nbsp;&nbsp;Remainder: 2000 - 2013';

    } else if (periodValues.geo === "province" || periodValues.geo === "district") {
      document.getElementById('period-info').innerHTML = '*Data period: 1999 - 2013';

    } else {
      document.getElementById('period-info').innerHTML = '*Data period:';

    }

  } else if (periodValues.category === "ataxy") {
    if (periodValues.geo === "country") {
      document.getElementById('period-info').innerHTML = '*Data period:<br>&nbsp;&nbsp;&nbsp;Austria: 2002 - 2014<br>&nbsp;&nbsp;&nbsp;United Kingdom: 2000 - 2013<br>&nbsp;&nbsp;&nbsp;Remainder: 2000 - 2012';

    } else if (periodValues.geo === "province" || periodValues.geo === "district") {
      document.getElementById('period-info').innerHTML = '*Data period: 1999 - 2013';

    } else {
      document.getElementById('period-info').innerHTML = '*Data period:';

    }

  } else {
    document.getElementById('period-info').innerHTML = '*Data period: 1999 - 2013';
  }
}

$(function() {
    $("#download_link_map").click(function() {
	var getOverlay = function(){
		var svg = d3.select('.leaflet-overlay-pane > svg'),
		img = new Image(),
		serializer = new XMLSerializer();
      		console.log("svg ", svg.attr("width"), svg.attr("height"));
      		var svgStr = serializer.serializeToString(svg.node());
      		img.src = 'data:image/svg+xml;base64,'+window.btoa(svgStr);
		return img;

    	};
	leafletImage(map, function(err, canv) {
		var img_ = getOverlay();

		var svg = d3.select('.leaflet-overlay-pane > svg');
		var w =  svg.attr("width");
		var h = svg.attr("height");
		var pane = d3.select('.leaflet-map-pane');
		var trans = pane.style("transform");
		t = d3.select('.leaflet-map-pane').style('transform').split(", ");
		var dx = t[4], dy = t[5].split(")")[0];
		var img = new Image();

		img.onload = function() {
			canv.getContext("2d").drawImage(img, dx, dy, w, h);
			html2canvas(document.getElementsByClassName("legend")[0],{allowTaint: true,}).then(function(canvas) {
				var h2 = canv.height;
				canv.getContext("2d").drawImage(canvas, 10, h2-canvas.height-10);
				canv.toBlob(function(blob) { saveAs(blob, "imagen.png"); });
			});
      html2canvas(document.getElementsByClassName("info")[0],{allowTaint: true,}).then(function(canvas) {
        var w3 = canv.width;    //Este es el ancho del mapa
        // Ahora, al segundo parámetro de drawImage le dices que te lo dibuje a la derecha del todo restándole al ancho del mapa el ancho de la leyenda con el nombre de la enfermedad (canvas.width), menos 10 píxeles para que deje un pequeño margen
        canv.getContext("2d").drawImage(canvas, w3 - canvas.width - 10, 10);
        canv.toBlob(function(blob) { saveAs(blob, "imagen.png"); });
      });

		};
		img.src = img_.src;


	});
    });
});
