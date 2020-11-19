//Global Vars
let apiKey = '3037486a16mshc6512bad445d222p100853jsnc25d6486900b'
let appID = 'wu2NZ7wMWa5kcBJ2Okrx'
let fuelAppApiKey = 'rBMnSNgmY86eyVSBI1tFCJ7G6J5rC3OcsyPwL7xOvIw'
var fuelOutPut = $('#example').val()
let userPosition = $("#result").val()

//Json web token credentials
let JSONwebToken = '0LUvCafeaQ4taVT6uNYleX6pNyF37UpsNJWgDabOXfUjUWcoXJ9m48ZT8M5ZWTMDSHcmFWmwjfHvuB7kBXSatw'
let accessKeyId = 'JPP0pPukzSdRomRRqvuxgg'
// Rest Api credentails
let restAppId = "sQCEUM1tDeCqiMmQGE2X"
let restApiKey = "Sk529ATwSKfY2Ms96plU1rkpHasGvgXHnjMUlEzu0HY"
//Javascript Here credentails
let jsAppId = "ZDmjBoiHdg5JILLoGycJ"
let jsApiKey = "Q13x91mhppBgmOOFhI0rpSjimt9kHezCQclpMEpKtbE"
var latitude;
var longitude;


// Geo location variables
// to retrieve current user postion

//========================================================================
// Geo Location functions
//=======================================================

function getLocation() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

$("#select-vehicle-type").on("change", function () {
    if ($("#select-vehicle-type :selected").val() === "gas") {
        $("#gas-container").attr("class", "container mt-5 has-text-centered");
    } else if ($("#select-vehicle-type :selected").val() === "electric") {
        $('#evConnector-container').attr("class", "container mt-5 has-text-centered");
        $('#evChargerType-container').attr("class", "container mt-5 has-text-centered");
        $("#gas-container").attr("class", "container mt-5 has-text-centered is-hidden");
    }
})

//========================================================
//Section of code below is for the user input to be displayed on the dashboard listed
//=======================================================
//the submit button

//open modal
$("#submit-button").on("click", function () {
    var radius = $("#select-radius :selected").val();
    if (radius === "Select search radius") {
        $("#select-radius").attr("class", "select is-rounded is-danger is-large is-focused");
        $("#select-radius").append('<span class="icon is-small is-left"><i class="fas fa-exclamation-triangle"></i> </span>');
        $("#radius-container").attr("class", "control mt-5 has-text-centered has-icons-left");
        return;
    }
    $("#results").attr("class", "modal is-active");
    var vehicleType = $('#select-vehicle-type :selected').val()
    if (vehicleType === "gas") {
        fuelInfo()
    }
    else{
        electricInfo();
    }
})

$("#current-location").on("click", function () {
    getLocation()
        .then((position) => {
            console.log(position);
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log(latitude);
            console.log(longitude);
            $("#address").attr("placeholder", latitude + ", " + longitude);
        })
})
//close modal
$("#close-modal").on("click", function () {
    $("#results").attr("class", "modal");
})

function selectEVType() {
    if ($("#select-connector-type :selected").val() === "Select Connector Type") {
        evType = "all";
    } 
    evType = $("#select-connector-type :selected").val();
}

function selectEVLevel() {
    if ($("#select-charger-level :selected").val() === "Select Charger Type") {
        evLevel = "all";
    }
    evLevel = $("#select-charger-level :selected").val();
}

function electricInfo() {
        var electricAPIKey = "Th9TbtOCXmrJhKEo2F7cW2Srorv25I70XaPcviiw";
        var electricLocation = encodeURI($("#address").val());
        var radius = $("#select-radius :selected").val();
        selectEVType();
        selectEVLevel();
        if (electricLocation !== "") {
            console.log(electricLocation);
            var electricQueryURL = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=" + electricAPIKey + "&location=" + electricLocation + "&radius=" + radius + "&ev_connector_type=" + evType + "&ev_charging_level" + evLevel + "&fuel_type=ELEC&limit=10";
        } else {
            saveCoords();
            electricQueryURL = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=" + electricAPIKey + "&latitude=" + latitude + "&longitude=" + longitude + "&radius=" + radius + "&ev_connector_type=" + evType + "&ev_charging_level" + evLevel + "&fuel_type=ELEC&limit=10";
        }
    
    $.ajax({
        url: electricQueryURL,
        method: "GET"

    }).then(function (electricResponse) {
        console.log(electricResponse)
        for (i = 0; i < electricResponse.fuel_stations.length; i++) {
            // Variables that are being pulled
            var fuelStation = electricResponse.fuel_stations[i]
            var stationName = fuelStation.station_name;
            var stationAddress = fuelStation.street_address
            var evType = fuelStation.ev_connector_types[0]
            var howFar = fuelStation.distance
            console.log(stationName)
            console.log(stationAddress)
            console.log(evType)
            console.log(howFar)


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
            $('#modal-card').append(split);

        }
    }
    )
}

function fuelInfo() {
    var fuelAPIKey= "Th9TbtOCXmrJhKEo2F7cW2Srorv25I70XaPcviiw";
    var fuelLocation = encodeURI($("#address").val());
    var radius= $("#select-radius :selected").val();
    var fuelType = $('#select-fuel-type :selected').val();
    
    if (fuelLocation !== "") {
        console.log(fuelLocation);
    var fuelQueryURL= "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=" + fuelAPIKey + "&location=" + fuelLocation +  "&radius=" + radius +  "&fuel_type=" + fuelType + "&limit=10";
    } else {
        var fuelQueryURL= "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=" + fuelAPIKey + "&latitude=" + latitude + "&longitude=" + longitude + "&radius=" + radius + "&fuel_type=" + fuelType + "&limit=10";
    }
    $.ajax({
        url: fuelQueryURL,
        method: "GET"
    }).then(function(fuelResponse) {
        console.log(fuelQueryURL)
        for (i=0; i < fuelResponse.fuel_stations.length; i++){
            
            // Variables that are being pulled
            var fuelStation = fuelResponse.fuel_stations[i]
            var stationName = fuelStation.station_name;
            var stationAddress = fuelStation.street_address
            var fuelKind = fuelStation.fuel_type_code
           
            var howFar = fuelStation.distance
            console.log(stationName)
            console.log(stationAddress)
            console.log(howFar)
            
 
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
            $('#modal-card').append(split);

        }
    }
    )