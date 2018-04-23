const btnSubmitLocation = document.getElementById("btnSubmitLocation");
const containerForForecast = document.getElementById("containerForForecast");
const inputLocation = document.getElementById("inputLocation");
const headlineLocation = document.getElementById("headlineLocation");
const containerForecast = document.getElementById("containerForecast");

let jWeatherResponse;

btnSubmitLocation.addEventListener("click", function(){
  const sTempUnit = document.getElementsByName('temperatureUnit');
  let sLocation = inputLocation.value.toString().toLowerCase().trim();
  console.log(sLocation);
  let sSelectedUnit;
  for(let i = 0; i < sTempUnit.length; i++){
    if (sTempUnit[i].checked){
      sSelectedUnit = sTempUnit[i].value;
      console.log(sSelectedUnit)
      break;
    }
  }
  
  let sUnit = `u='${sSelectedUnit}'`;
  headlineLocation.innerHTML = "";
  containerForecast.innerHTML = "";

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let sjWeatherResponse = this.responseText;
      jWeatherResponse = JSON.parse(sjWeatherResponse);
      
      showWeather();
    }
  };
  xhttp.open("GET", `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${sLocation}%2C%20ak%22)%20and%20${sUnit}&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`, true);
  xhttp.send();
});

function showWeather(){
  let sCity = jWeatherResponse.query.results.channel.location.city;
  let sRegion = jWeatherResponse.query.results.channel.location.region;
  let sCountry = jWeatherResponse.query.results.channel.location.country;
  let htmlLocationHeadline = `<h2>${sCity}, ${sRegion}, ${sCountry}</h2>`;
  headlineLocation.insertAdjacentHTML("beforeend", htmlLocationHeadline);
  let aForecast = jWeatherResponse.query.results.channel.item.forecast;
  aForecast.forEach(function(day){
    let sDay = day.day;
    let sDate = day.date;
    let sDescription = day.text;
    let sHighTemp = day.high;
    let sLowTemp = day.low;
    let htmlForecast = `<p>${sDay} ${sDate} <br> It will be ${sDescription} with temperatures up to ${sHighTemp} and down to ${sLowTemp}.</p>`;
    containerForecast.insertAdjacentHTML("beforeend", htmlForecast);

  })
}