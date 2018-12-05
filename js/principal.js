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

  if (selectDisease.value === "ataxy" || selectDisease.value === "huntington" || selectDisease.value === "neuron") {
    var countryExists = ($('#geoMap option[value=country]').length > 0);

    if (!countryExists) {
      $('#geoMap').append($('<option>', { value: "country", text: 'Pais'}));

    }

  }

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
      $('#rate').append($('<option>', { value: "ta", text: 'Tasa ajustada por edad'}));

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
      $('#rate :nth-child(2)').after("<option value='pps'>Probabilidad a posteriori</option>");

    }

    // add rrs if not exists
    let rrsExists = ($('#rate option[value=rrs]').length > 0);
    if (!rrsExists) {
      $('#rate :nth-child(2)').after("<option value='rrs'>Razón de Mortalidad Estandarizada Suavizada</option>");

    }

    // add rme if not exists
    let rmeExists = ($('#rate option[value=rme]').length > 0);
    if (!rmeExists) {
      $('#rate').append($('<option>', { value: "rme", text: 'Razón de Mortalidad Estandarizada'}));


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
      $('#sex').append($('<option>', { value: "women", text: 'Mujeres'}));

    }

    // add men if not exists
    let menExists = ($('#sex option[value=men]').length > 0);
    if (!menExists) {
      $('#sex').append($('<option>', { value: "men", text: 'Hombres'}));

    }

  }

});


// TREND --- Show/hide country options based on rare disease select
const selectTrendDisease = document.querySelector("select#rare-disease-trend");
selectTrendDisease.addEventListener("change", function(ev) {


  // Countries with huntington
  const huntingtonCountries = [ ["austria", "Austria"],
                            ["belgium", "Bélgica"],
                            ["croatia", "Croacia"],
                            ["czechia", "República Checa"],
                            ["denmark", "Dinamarca"],
                            ["finland", "Finlandia"],
                            ["france", "Francia"],
                            ["germany", "Alemania"],
                            ["hungary", "Hungría"],
                            ["lithuania", "Lituania"],
                            ["luxembourg", "Luxemburgo"],
                            ["netherlands", "Países Bajos"],
                            ["norway", "Noruega"],
                            ["poland", "Polonia"],
                            ["romania", "Rumanía"],
                            ["sweden", "Suecia"],
                            ["switzerland", "Suiza"],
                            ["unitedkingdom", "Reino Unido"],
                            ["malta" , "Malta"],
                            ["bulgaria", "Bulgaria"],
                            ["cyprus", "Chipre"],
                            ["estonia", "Estonia"],
                            ["iceland", "Islandia"],
                            ["ireland", "Irlanda"],
                            ["italy", "Italia"],
                            ["latvia", "Letonia"],
                            ["moldova", "Moldavia"],
                            ["portugal", "Portugal"],
                            ["serbia", "Serbia"],
                            ["slovakia", "Eslovaquia"],
                            ["slovenia", "Eslovenia"]
                          ];


  const ataxyCountries = [ ["austria", "Austria"],
                            ["belgium", "Bélgica"],
                            ["croatia", "Croacia"],
                            ["czechia", "República Checa"],
                            ["denmark", "Dinamarca"],
                            ["finland", "Finlandia"],
                            ["france", "Francia"],
                            ["germany", "Alemania"],
                            ["hungary", "Hungría"],
                            ["lithuania", "Lituania"],
                            ["luxembourg", "Luxemburgo"],
                            ["netherlands", "Países Bajos"],
                            ["norway", "Noruega"],
                            ["poland", "Polonia"],
                            ["romania", "Rumanía"],
                            ["sweden", "Suecia"],
                            ["switzerland", "Suiza"],
                            ["unitedkingdom", "Reino Unido"]
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
      $('#geoTrend').append($('<option>', { value: "spain", text: 'España'}));

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
    msg("error", "Por favor, seleccione una enfermedad rara.")

  } else if (!formElements.geo) {
    msg("error", "Por favor, seleccione una unidad geográfica.")

  } else if (!formElements.rate) {
    msg("error", "Por favor, seleccione un indicador epidemiológico.")

  } else if (!formElements.sex) {
    msg("error", "Por favor, seleccione un sexo.")

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
    msg("error", "Por favor, seleccione una enfermedad rara.")

  } else if (!formElements.geo) {
    msg("error", "Por favor, seleccione un país.")

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
      return rateValue > 90   ? 'transparent' :
             rateValue > 0.90 ? '#d64700' :
             rateValue > 0.80 ? '#ffaa00' :
             rateValue > 0.20 ? '#ffffbf' :
             rateValue > 0.10 ? '#66c763' :
            '#1a9850';
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
function getColorTa(rateValue) {
  return rateValue > 90 ? '#b3b3b3' :
         rateValue > 0.9 ? '#d64700' :
         rateValue > 0.8 ? '#ffaa00' :
         rateValue > 0.2 ? '#ffffbf' :
         rateValue > 0.1 ? '#66c763' :
         '#1a9850';
}

// TA legend configuration
var legendTa = L.control({position: 'bottomleft'});
legendTa.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 0.10, 0.20, 0.80, 0.90, 90],
      labels = [" < 0.1", "0.1 - 0.2", "0.2 - 0.8", "0.8 - 0.9", " > 0.9"];

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColorTa(grades[i+1]) + '"></i> ' +
    labels[i] + '<br>';
  }
  return div;
}


/* MAP --- Information control configuration*/

// Legend control
function createInfoControl() {
  let info = L.control();

  info.onAdd = function() {
    this._container = L.DomUtil.create('div', 'info info-control');
    this._title = L.DomUtil.create('h4');
    this._rate = L.DomUtil.create('div');
    this._container.appendChild(this._title);
    this._container.appendChild(this._rate);
    this.reset();
    return this._container;
  }
  info.reset = function() {
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
          fontSize: 6,
          position: 'right'
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
					labelString: 'Tasa de Mortalidad ajustada por edad por 100.000 habitantes',
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
      label: "Hombres",
      data: datasetMenData,
      borderColor: "#76a892",
      backgroundColor: "transparent",
      spanGaps: true,
      pointStyle: 'line'
    },
    {
      label: "Mujeres",
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
var mapSubmitButton = document.querySelector("input[type=submit]");
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
    map.removeControl(currentLegend);
    currentLegend = legendTa;
    currentLegend.addTo(map);

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
  const validateTrendFormSubmit = validateTrendForm();
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
      document.getElementById('period-info').innerHTML = '*Periodo de datos:<br>&nbsp;&nbsp;&nbsp;Austria: 2002 - 2013<br>&nbsp;&nbsp;&nbsp;Resto: 2001 - 2012';

    } else if (periodValues.geo === "province" || periodValues.geo === "district") {
      document.getElementById('period-info').innerHTML = '*Periodo de datos: 1999 - 2013';

    } else {
      document.getElementById('period-info').innerHTML = '*Periodo de datos:';

    }
  } else if (periodValues.category === "neuron") {
    if (periodValues.geo === "country") {
      document.getElementById('period-info').innerHTML = '*Periodo de datos: <br>&nbsp;&nbsp;&nbsp;Austria: 2002 - 2014<br>&nbsp;&nbsp;&nbsp;Dinamarca: 2000 - 2012<br>&nbsp;&nbsp;&nbsp;Resto: 2000 - 2013';

    } else if (periodValues.geo === "province" || periodValues.geo === "district") {
      document.getElementById('period-info').innerHTML = '*Periodo de datos: 1999 - 2013';

    } else {
      document.getElementById('period-info').innerHTML = '*Periodo de datos:';

    }

  } else if (periodValues.category === "ataxy") {
    if (periodValues.geo === "country") {
      document.getElementById('period-info').innerHTML = '*Periodo de datos:<br>&nbsp;&nbsp;&nbsp;Austria: 2002 - 2014<br>&nbsp;&nbsp;&nbsp;Reino Unido: 2000 - 2013<br>&nbsp;&nbsp;&nbsp;Resto: 2000 - 2012';

    } else if (periodValues.geo === "province" || periodValues.geo === "district") {
      document.getElementById('period-info').innerHTML = '*Periodo de datos: 1999 - 2013';

    } else {
      document.getElementById('period-info').innerHTML = '*Periodo de datos:';

    }

  } else {
    document.getElementById('period-info').innerHTML = '*Periodo de datos: 1999 - 2013';
  }
}
