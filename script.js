//Global Vars

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
    var electricQueryURL= "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=" + electricAPIKey + "&latitude=" + latitude + "&longitude=" + longitude + "&radius=" + radius+ "&fuel_type=ELEC&limit=1";
    console.log(electricQueryURL);
    $.ajax({
        url: electricQueryURL,
        method: "GET"
    }).then(function(electricResponse) {
        console.log(electricResponse)
    })
}
