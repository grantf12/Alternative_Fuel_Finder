let apiKey ='3037486a16mshc6512bad445d222p100853jsnc25d6486900b'
let appID = 'wu2NZ7wMWa5kcBJ2Okrx'
let fuelAppApiKey = 'rBMnSNgmY86eyVSBI1tFCJ7G6J5rC3OcsyPwL7xOvIw'
var fuelOutPut = $('#example').val()
let userPosition = $("#result").val() 


//========================================================================
// Geo Location functions
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

function makeFuelList(){
    let = $('<li>','<button>').addClass('btn list-group-item').text(station);
    $('list').append(listItem)
};

$("#select-vehicle-type").on("change", function(){
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
$("#exampleBtn").click(function(){
    event.preventDefault();
    example = $('#example').val();
    $('#example').val("");

    const queryUrl = "https://community-nrel-national-renewable-energy-laboratory.p.rapidapi.com/api/alt-fuel-stations/v1.json?state=North%20Carolina&zip=28217&fuel_type=E85%2CELEC&limit=2"

    $.ajax({
        url: queryUrl,
        method: "GET"
      }).then(function (response) {
          console.log(response);


      })
})


