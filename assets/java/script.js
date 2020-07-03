var featuredCityEl = document.getElementById("featured-city");
var cityInfoEl = document.getElementById("city-info");
var citySearchEl = document.getElementById("city-search")
var searchBarEl = document.getElementById("search-bar");
var forecastCardsEl = document.getElementById("forecast-cards");
var previousCitiesEl = document.getElementById("list-of-cities");
var cityArr = [];









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
            getForecast(data.coord.lat, data.coord.lon);
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
    cityArr.push(conditions.name)
    localStorage.setItem("cities", JSON.stringify(cityArr));
    console.log(cityArr);
    //clear out any old content
    cityInfoEl.textContent = "";
    featuredCityEl.textContent = cityName + " ( " + currentTime + " )";
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
        else if (uv <= 5 && uv > 2) {
            uvValue.classList = "badge badge-pill badge-warning";
        }
        else if (uv <= 7 && uv > 5) {
            uvValue.classList = "badge badge-pill orange";
        }
        else if (uv <= 10.9 && uv > 7) {
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
var getForecast = function(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly&units=imperial&appid=7b788606d2ca3b8dec8a6e5ab63f1a3c")
    .then(function(response) {
        response.json().then(function(data) {
            displayForecast(data);
        });
    });
}
var displayForecast = function(data) {
    //clear out any previous forecasts
    forecastCardsEl.textContent = ""
    //loop over forecasts up to five days
    for (var i = 1; i < data.daily.length-2; i++) {
        var cardDeck = document.createElement("div");
        cardDeck.classList = "card text-white text-center bg-primary mb-3"

        var dayStamps = document.createElement("div");
        dayStamps.classList = "card-body";
        var timeStamp = document.createElement("h4");
        timeStamp.classList = "card-title";
        timeStamp.textContent = moment.unix(data.daily[i].dt).format("MM/DD");
        //append date to top of card
        dayStamps.appendChild(timeStamp);
        //var for forecast icon 
        var weather = document.createElement("img")
        weather.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");
        dayStamps.appendChild(weather);
        //append to carddeck
        //var for temperature
        var hiTemp = document.createElement("p"); 
        hiTemp.classList = "high-temp";
        hiTemp.textContent = Math.floor(data.daily[i].temp.max) + " °F";
        //append to card
        dayStamps.appendChild(hiTemp);
        //var for low temperature
        var loTemp = document.createElement("p");
        loTemp.classList = "low-temp";
        loTemp.textContent = Math.floor(data.daily[i].temp.min) + " °F";
        //append to card
        dayStamps.appendChild(loTemp);
        //var for humidity 
        var humidity = document.createElement("p");
        humidity.classList = "humidity";
        humidity.textContent = "Humidity: " + data.daily[i].humidity + "%";
        //append to card
        dayStamps.appendChild(humidity);
        cardDeck.appendChild(dayStamps);
        //append cards to div
        forecastCardsEl.appendChild(cardDeck);
    }
}
var cityDisplay = function (i) {
    
   
}

var storedCities = JSON.parse(localStorage.getItem("cities"));
console.log(storedCities);
var showStoredCities = function() {
    if (storedCities > 6)  {
        localStorage.removeItem([0]);
    } else {
        for(var i = 0; i < storedCities.length; i++) {
            var cityList = document.createElement("div");
            cityList.classList = "card city-card";
            //create card body
            var cityListEl = document.createElement("button");
            cityListEl.classList = "cityButton card-body btn btn-primary";
            cityListEl.setAttribute("type", "button");
            cityListEl.setAttribute("id", "cityBtn");
            cityListEl.textContent = storedCities[i];
            cityList.appendChild(cityListEl);
            //append all to div to display
            previousCitiesEl.appendChild(cityList);
            document.querySelectorAll('.cityButton').forEach(item => {
                item.addEventListener('click', function() {
                    console.log(storedCities[1]);
                })
              })
        }
       
        // var cityListEl = document.getElementById('cityBtn');
        // cityListEl.addEventListener("click", function(){
        //     console.log(storedCities)
        //     //getCityInfo(text);
        // });
    }
};
showStoredCities();
var currentTime = moment().format("MMMM Do, YYYY");
searchBarEl.addEventListener("submit", searchCityHandler);
