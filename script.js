
let apiKey ='3037486a16mshc6512bad445d222p100853jsnc25d6486900b'
let appID = 'wu2NZ7wMWa5kcBJ2Okrx'
let fuelAppApiKey = 'rBMnSNgmY86eyVSBI1tFCJ7G6J5rC3OcsyPwL7xOvIw'
var fuelOutPut = $('#example').val()
let userPosition = $("#result").val() 


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
//
//$("#sumbit-type").click(function () { //user clicks button
//	if ("geolocation" in navigator){ //check geolocation available 
//		//try to get user current location using getCurrentPosition() method
//		navigator.geolocation.getCurrentPosition(function(position){ 
//                $("#result").html("Found your location <br />Lat : "+position.coords.latitude+" </br>Lang :"+ position.//coords.longitude);
//			});
//	}else{
//		console.log("Browser doesn't support geolocation!");
//	}
//});
//=======================================================
//Global Vars
//=======================================================
//Json web token credentials
let JSONwebToken = '0LUvCafeaQ4taVT6uNYleX6pNyF37UpsNJWgDabOXfUjUWcoXJ9m48ZT8M5ZWTMDSHcmFWmwjfHvuB7kBXSatw'
let accessKeyId = 'JPP0pPukzSdRomRRqvuxgg'
// Rest Api credentails
let restAppId = "sQCEUM1tDeCqiMmQGE2X"
let restApiKey = "Sk529ATwSKfY2Ms96plU1rkpHasGvgXHnjMUlEzu0HY"
//Javascript Here credentails
let jsAppId = "ZDmjBoiHdg5JILLoGycJ"
let jsApiKey = "Q13x91mhppBgmOOFhI0rpSjimt9kHezCQclpMEpKtbE"


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
$("#submit-type").click(function (event) {
    event.preventDefault();

    $.ajax({
        url: queryLocationUrl,
        method: "GET"
      }).then(function (response) {

         console.log(queryLocationUrl);
         console.log(response);

      })
// put geolocation function
})

$("#submit-button").on("click", function(){
    $("#results").attr("class", "modal is-active");
})

$("#close-modal").on("click", function(){
    $("#results").attr("class", "modal");
})

findStations();

})

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

