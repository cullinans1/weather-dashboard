var featuredCityEl = document.getElementById("featured-city");
var cityInfoEl = document.getElementById("city-info");
var citySearchEl = document.getElementById("city-search")
var searchBarEl = document.getElementById("search-bar");


var searchCityHandler = function(event) {
    event.preventDefault();
    var cityName = citySearchEl.value.trim();
    if (cityName) {
        getCityInfo(cityName);
        citySearchEl.value = "";
    } else {
        alert("Please enter a city to see its results!")
        return;
    };
};
var getCityInfo = function(city, state) {

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + "&units=imperial&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c")
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
            displayCityInfo(data, data.name, data.weather[0].icon);
            //getUV(data.coord.lat, data.coord.lon);
            });
        } else {
            alert("Error: City " + response.statusText + "! Remember to enter the city name correctly. For a more specific result enter the city and state separated by a comma.");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to OpenWeather :(");
    });
}
var displayCityInfo = function(conditions, cityName, weatherIcon) {
    //clear out any old content
    cityInfoEl.textContent = "";
    featuredCityEl.textContent = cityName + " ( " + currentTime + " )";
// featuredCityEl.classList = "city-title";
    //weather icon 
    var weather = document.createElement("img")
    weather.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
    featuredCityEl.appendChild(weather);

    //function to get UV index from another API
    var getUV = function() {
        fetch("https://api.openweathermap.org/data/2.5/uvi?&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c&lat="+ conditions.coord.lat + "&lon=" + conditions.coord.lon)
        .then(function(response){
                response.json().then(function(data) {
                showUV(data.value);
                });
        });
    };
    getUV();
    //add current conditions i.e. temp, humidity, etc.
    var currentConditions = document.createElement("ul");
    currentConditions.classList = "weather-conditions";
    //get info for current temp
    var currentTemp = document.createElement("li");
    currentTemp.textContent = "Temperature: " + Math.round(conditions.main.temp) + " °F";
    //append current temp to list
    currentConditions.appendChild(currentTemp);
    //get info for humidity
    var humidity = document.createElement("li");
    humidity.textContent = "Humidity: " + conditions.main.humidity + "%";
    //append to list
    currentConditions.appendChild(humidity);
    //get info for wind speed
    var windSpeed = document.createElement("li");
    windSpeed.textContent = "Wind Speed: " + conditions.wind.speed + " MPH";
    //append wind info to list
    currentConditions.appendChild(windSpeed);
    //get uv data 
    var showUV = function(uv) {
        var uvIndex = document.createElement("li");
        uvIndex.textContent = "UV Index: ";
        var uvValue = document.createElement("p");
        uvValue.textContent = uv

        if(uv <= 2) {
            uvValue.classList = "badge badge-pill badge-success";
        }
        else if (uv <= 5 && uv >= 3) {
            uvValue.classList = "badge badge-pill badge-warning";
        }
        else if (uv <= 7 && uv >= 6) {
            uvValue.classList = "badge badge-pill orange";
        }
        else if (uv <= 10 && uv >= 8) {
            uvValue.classList = "badge badge-pill badge-danger"
        }
        else if (uv >= 11) {
            uvValue.classList = "badge badge-pill purple"
        };
        uvIndex.appendChild(uvValue);
        currentConditions.appendChild(uvIndex);
    };
    //append all info to the main div
    cityInfoEl.appendChild(currentConditions);
};
var currentTime = moment().format("MMMM Do, YYYY");
searchBarEl.addEventListener("submit", searchCityHandler);