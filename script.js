var latitude;
var longitude;
var locations = [];
var saveSettings= [];
// document.cookie = 'cookie2=value2; SameSite=None; Secure';

//========================================================================
// Geo Location functions
//=======================================================

function initMap() {
    var searchLoc = { lat: latitude, lng: longitude };
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: searchLoc,
    });
    for (var m = 0; m < locations.length; m++)
        var marker = new google.maps.Marker({
            position: locations[m],
            map: map,
        });
}

function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
};

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);
    console.log(position.coords.latitude + "" + position.coords.longitude);
    trafficInfo(position.coords);
   };


function findMe() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function saveCoords() {
    findMe()
        .then((position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        })
}

//select vehicle type shows gas or electric container depending on choice
$("#select-vehicle-type").on("change", function () {
    if ($("#select-vehicle-type :selected").val() === "gas") {
        $("#gas-container").attr("class", "container mt-5 has-text-centered");
        $('#evConnector-container').attr("class", "container mt-5 has-text-centered is-hidden");
        $('#ev-level-container').attr("class", "container mt-5 has-text-centered is-hidden")
    } else if ($("#select-vehicle-type :selected").val() === "electric") {
        $('#evConnector-container').attr("class", "container mt-5 has-text-centered");
        $('#ev-level-container').attr("class", "container mt-5 has-text-centered");
        $("#gas-container").attr("class", "container mt-5 has-text-centered is-hidden");
    }
})
//========================================================
//Section of code below is for the user input to be displayed on the dashboard listed
//=======================================================
//the submit button

function checkLocation() {
    if ($("#address").val() !== "") {
        return;
    } else {
        $("#address").attr("class", "input is-large column is-danger");
        $("#address").append('<span class="icon is-small is-left"><i class="fas fa-exclamation-triangle"></i> </span>');
        $("#address-container").attr("class", "control mt-5 has-text-centered has-icons-left");
    }
}

//open modal
$("#submit-button").on("click", function () {
    var radius = $("#select-radius :selected").val();
    if (radius === "Select search radius") {
        $("#select-radius").attr("class", "select is-rounded is-danger is-large is-focused");
        $("#select-radius").append('<span class="icon is-small is-left"><i class="fas fa-exclamation-triangle"></i> </span>');
        $("#radius-container").attr("class", "control mt-5 has-text-centered has-icons-left");
        return;
    }
    if ($("#address").val() !== "") {
        $("#results").attr("class", "modal is-active");
        var vehicleType = $('#select-vehicle-type :selected').val()
        if (vehicleType === "gas") {
            fuelInfo()
        }
        else {
            electricInfo();
        }
    } else {
        $("#address").attr("class", "input is-medium column is-danger");
        $("#current-location").attr("class", "icon button is-danger is-large")
        return;
    }
   
})

$("#current-location").on("click", function () {
    findMe()
        .then((position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            $("#address").attr("value", latitude + ", " + longitude);
        })
})
//close modal
$("#close-modal").on("click", function () {
    $("#results").attr("class", "modal");
    $("#list").html("");
    $("#map").html("");
    
})

function storeSettings() {
    localStorage.setItem("settings", JSON.stringify(saveSettings));
}

function renderSettings() {
    var saveSettings = JSON.parse(localStorage.getItem("settings"));
    if (localStorage.getItem("settings") === null) {
        return;
    }
    $("#select-vehicle-type").find("option[value=" + saveSettings[0].type).attr('selected','selected');
    $("#address").attr("value", saveSettings[0].location);
}


//==============================================
// Bounding box instructor helped "Anthony"

// function generateBoundingBox(lat, lng, radius) {
//     console.log(lat,lng)
//     lat = parseFloat(lat);
//     lng = parseFloat(lng);
//     radius = parseInt(radius);
//     var fixed = function(value) {
//       return value.toFixed(6);
//     };
//     console.log(lat,lng)
//     var latToMiles = (1/69) * radius;
//     var lngToMiles = (1/54) * radius;
//     var leftTop = [fixed(lat - latToMiles), fixed(lng - lngToMiles)];
//     var rightBottom = [fixed(lat + latToMiles), fixed(lng + lngToMiles)];
//     return leftTop.concat(rightBottom).join();
//   }


// function trafficInfo(pos) {
  
//     const queryLocationUrl = "http://www.mapquestapi.com/traffic/v2/incidents?key=ANyNQWQRMCwYtIcEivl0YidZMG4FgAJc&boundingBox=" + generateBoundingBox(pos.latitude,pos.longitude, 25) + "&filters=construction,incidents,events,congestion";

//     $.ajax({
//         url: queryLocationUrl,
//         method: "GET",
//     }).then(function (response) {
//         console.log(response)
//     })
// }

function electricInfo() {
    var typeVehicle = "electric"
    var electricAPIKey = "Th9TbtOCXmrJhKEo2F7cW2Srorv25I70XaPcviiw";
    var address = ($("#address").val());
    var electricLocation = encodeURI(address);
    var radius = $("#select-radius :selected").val();
    var evType = $("#select-connector-type :selected").val()
    var evLevel= $("#select-charger-level :selected").val();
    if (electricLocation !== "") {
        electricQueryURL = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=" + electricAPIKey + "&location=" + electricLocation + "&radius=" + radius + "&ev_connector_type=" + evType + "&ev_charging_level=" + evLevel + "&fuel_type=ELEC&limit=10";
        var locationSave = address
    } else {
        saveCoords();
        electricQueryURL = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=" + electricAPIKey + "&latitude=" + latitude + "&longitude=" + longitude + "&radius=" + radius + "&ev_connector_type=" + evType + "&ev_charging_level=" + evLevel + "&fuel_type=ELEC&limit=10";
        var locationSave = latitude + ", " + longitude;
    }
    saveSettings.push({
        type: typeVehicle,
        location: locationSave
    })
    $.ajax({
        url: electricQueryURL,
        method: "GET"
    }).then(function (electricResponse) {
        console.log(electricResponse)
        for (i = 0; i < electricResponse.fuel_stations.length; i++) {

            // Variables that are being pulled
            var fuelStation = electricResponse.fuel_stations[i];
            var stationName = fuelStation.station_name;
            var stationAddress = fuelStation.street_address;
            var evType = fuelStation.ev_connector_types[0];
            var howFar = fuelStation.distance;
            optionLat = (fuelStation.latitude);
            optionLong = (fuelStation.longitude);

            locations.push({ lat: optionLat, lng: optionLong })
                
            // Variables that need to be made and appended
            var container1 = $('<div class="container p-3 mt-1"></div>')
            var row = $('<div class="row"></div>')
            var col1 = $('<div class="columns"></div>')
            var col2 = $('<div class="column is-8"></div>')
            var title = $('<div class="subtitle" id="name"></div>')
            $(title).text(stationName);
            var addy = $('<p class="row h3" id="address"></p>')
            $(addy).text(stationAddress);
            var col3 = $('<div class="column is-4"></div>')
            var EV = $('<p class="row has-text-weight-bold has-text-right">EV Type:</p>')
            var EV2 = $('<p class="has-text-right" id="EVType"></p>')
            $(EV2).text(evType);
            var row2 = $('<div class="row"></div>')
            var distanceTitle = $('<p class="row has-text-weight-bold has-text-right">Distance:</p>')
            var distanceAmount = $('<p class="has-text-right" id="goingTheDistance"></p>')
            $(distanceAmount).text(howFar.toFixed(2) + "mi");
            var split = $('<header class="card-header"></header>');

            // Appending each var to a card-body then append to #modal-card
            $(container1).append(row);
            $(row).append(col1);
            $(col1).append(col2, col3);
            $(col2).append(title, addy);
            $(col3).append(EV, EV2, row2);
            $(row2).append(distanceTitle, distanceAmount)
            $(split).append(container1);
            $('#list').append(split);  
            
        }

        var googleMap = $('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDDDdLFBl_Wnn1TbZojvb4jZTH3rgDDWh8&callback=initMap&libraries=&v=weekly" defer>');
        $("#map").append(googleMap);
    }
    )
    storeSettings();
}

function fuelInfo() {
    var typeVehicle = "gas";
    var fuelAPIKey = "Th9TbtOCXmrJhKEo2F7cW2Srorv25I70XaPcviiw";
    var address = ($("#address").val());
    var fuelLocation = encodeURI(address);
    var radius = $("#select-radius :selected").val();
    var fuelType = $('#select-fuel-type :selected').val();

    if (fuelLocation !== "") {
        console.log(fuelLocation);
        var fuelQueryURL = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=" + fuelAPIKey + "&location=" + fuelLocation + "&radius=" + radius + "&fuel_type=" + fuelType + "&limit=10";
        var locationSave = address;
    } else {
        var fuelQueryURL = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=" + fuelAPIKey + "&latitude=" + latitude + "&longitude=" + longitude + "&radius=" + radius + "&fuel_type=" + fuelType + "&limit=10";
        var locationSave = latitude + ", " + longitude;
    }
    saveSettings.push({
        type: typeVehicle,
        location: locationSave
    })
    $.ajax({
        url: fuelQueryURL,
        method: "GET"
    }).then(function (fuelResponse) {
        console.log(fuelQueryURL)
        for (i = 0; i < fuelResponse.fuel_stations.length; i++) {

            // Variables that are being pulled
            var fuelStation = fuelResponse.fuel_stations[i]
            var stationName = fuelStation.station_name;
            var stationAddress = fuelStation.street_address
            var fuelKind = fuelStation.fuel_type_code

            var howFar = fuelStation.distance
            console.log(stationName)
            console.log(stationAddress)
            console.log(howFar)
            optionLat = (fuelStation.latitude);
            optionLong = (fuelStation.longitude);

            locations.push({ lat: optionLat, lng: optionLong })


            // Variables that need to be made and appended
            var container1 = $('<div class="container p-3 mt-1"></div>')
            var row = $('<div class="row"></div>')
            var col1 = $('<div class="columns"></div>')
            var col2 = $('<div class="column is-8"></div>')
            var title = $('<div class="subtitle" id="name"></div>')
            $(title).text(stationName);
            var addy = $('<p class="row h3" id="address"></p>')
            $(addy).text(stationAddress);
            var col3 = $('<div class="column is-4"></div>')
            var EV = $('<p class="row has-text-weight-bold has-text-right">Fuel Type:</p>')
            var EV2 = $('<p class="has-text-right" id="FuelType"></p>')
            $(EV2).text(fuelKind);
            var row2 = $('<div class="row"></div>')
            var distanceTitle = $('<p class="row has-text-weight-bold has-text-right">Distance:</p>')
            var distanceAmount = $('<p class="has-text-right" id="goingTheDistance"></p>')
            $(distanceAmount).text(howFar.toFixed(2) + "mi");
            var split = $('<header class="card-header"></header>');

            // Appending each var to a card-body then append to #modal-card
            $(container1).append(row);
            $(row).append(col1);
            $(col1).append(col2, col3);
            $(col2).append(title, addy);
            $(col3).append(EV, EV2, row2);
            $(row2).append(distanceTitle, distanceAmount)
            $(split).append(container1);
            $('#list').append(split); 

        }
        var googleMap = $('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDDDdLFBl_Wnn1TbZojvb4jZTH3rgDDWh8&callback=initMap&libraries=&v=weekly" defer>');
        $("#map").append(googleMap);
    })
    storeSettings();
}

renderSettings();