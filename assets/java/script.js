var mainSearchEl = document.getElementById("city-name");
var cityInfoEl = document.getElementById("city-info");
var citySearchEl = document.getElementById("city-search")
var searchBarEl = document.getElementById("search-bar");


var searchCityHandler = function(event) {
    event.preventDefault();
    var cityName = citySearchEl.value.trim();
    getCityInfo(cityName);
}
var getCityInfo = function(city, state) {

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + "&units=imperial&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c")
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
            console.log(data, data.name, data.main.temp, data.main.humidity);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to OpenWeather :(");
    });
}
searchBarEl.addEventListener("submit", searchCityHandler);