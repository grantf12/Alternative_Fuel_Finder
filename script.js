//Global Vars
let apiKey ='3037486a16mshc6512bad445d222p100853jsnc25d6486900b'
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

var userpostion = getLocation();

//========================================================================
// Geo Location functions
//=======================================================
if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(function(position){
        console.log("Lat:" +position.coords.latitude+ "Lang :" + position.coords.longitude);
    });
}else{
    console.log('ERROR 404')
}



// Geo location variables
// to retrieve current user postion

var userpostion = getLocation();

//========================================================================
// Geo Location functions
//=======================================================

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
}

$("#select-vehicle-type").on("change", function () {
    if ($("#select-vehicle-type :selected").val() === "gas") {
        $("#gas-container").attr("class", "container m-3 mt-5 has-text-centered");
    } else {
        $("#gas-container").attr("class", "container m-3 mt-5 has-text-centered is-hidden");
    }
})

//========================================================
//Section of code below is for the user input to be displayed on the dashboard listed
//=======================================================
//the submit button

//open modal
$("#submit-button").on("click", function(){
    $("#results").attr("class", "modal is-active");
    electricInfo();
})

//close modal
$("#close-modal").on("click", function(){
    $("#results").attr("class", "modal");
})


findStations();

function findStations(position) {
    //var lon = position.coords.longitude;
    //var lat = position.coords.latitude;

    const queryLocationUrl = "https://fuel-v2.cc.api.here.com/fuel/stations.json?app_id=" + restAppId + "&app_code=" + restApiKey;// +// "&prox";

    $.ajax({
        url: queryLocationUrl,
        method: "GET",
        dataType:"jsonp"
    }).then(function (response) {
        console.log(queryLocationUrl);
        console.log(response);
    })
}

function electricInfo() {
    var electricAPIKey= "Th9TbtOCXmrJhKEo2F7cW2Srorv25I70XaPcviiw";
    var electricLocation = $("#address").val().trim();
    var radius= $("#select-radius :selected").val();
    var electricQueryURL= "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=" + electricAPIKey + "&latitude=" + latitude + "&longitude=" + longitude + "&radius=" + radius+ "&fuel_type=ELEC&limit=10";
    console.log(electricQueryURL);
    $.ajax({
        url: electricQueryURL,
        method: "GET"
    }).then(function(electricResponse) {
        console.log(electricResponse)
        for (i=0; i < electricResponse.fuel_stations.length; i++){
            
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
                var row = $('<div class="row"></div>')
                    var col1 = $('<div class="columns"></div>')
                        var col2 = $('<div class="column is-8"></div>')
                            var title = $('<div class="title" id="name"></div>')
                                $(title).text(stationName);
                            var addy = $('<p class="row subtitle" id="address"></p>')
                                $(addy).text(stationAddress)
                        var col3 = $('<div class="column is-4"></div>')
                            var EV = $('<p class="row has-text-weight-bold has-text-right">EV Type:</p>')
                            var EV2 = $('<p class="has-text-right" id="EVType"></p>') 
                                $(EV2).text(evType);
                        var row2 = $('<div class="row"</div>')
                            var distanceTitle = $('<p class="row has-text-weight-bold has-text-right">Distance:</p>')
                            var distanceAmount = $('<p class="has-text-right" id="goingTheDistance"></p>')
                                $(distanceAmount).text(howFar)
            
            // Appending each var to a card-body then append to #modal-card
            $(row).append(col1);
            $(col1).append(col2);
            $(col2).append(title, addy, col3);
            $(col3).append(EV, EV2, row2, distanceTitle, distanceAmount);
            $('#modal-card').append(row);

        }
    }
    )
}