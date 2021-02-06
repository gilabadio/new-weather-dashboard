var cityInputEl = document.getElementById("city-input");
var searchHistoryEl = document.getElementById("search-history");
var weatherEl = document.getElementById("weather");
var apiKey = "b0c7f7890fd4b66f3bf5aff8377ec0db";



function loadCities() {
  return JSON.parse(localStorage.getItem("cities")) || [];
}



function saveCity(cityName) {
  var cities = loadCities();
  if (cities.includes(cityName)) {
    return;
  }
  cities.push(cityName);
  localStorage.setItem("cities", JSON.stringify(cities));

  displayCities();
}



function displayCities() {
  var cities = loadCities();
  var tempHTML = "";
  for (var i = 0; i < cities.length; i++) {
    tempHTML += "<li class='list-group-item'>" + cities[i] + "</li>";
  }
  searchHistoryEl.innerHTML = tempHTML;
}



function getWeatherCoords(cityName) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        getWeather(data.name, data.coord.lat, data.coord.lon);
      });
    } else {
      displayError("Error: " + response.statusText);
    }

  }).catch(function (error) {
    displayError("Unable to connect to OpenWeather");
  });
}



function getWeather(name, latitude, longitude) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;



  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayWeather(name, data);
      });
    } else {
      displayError("Error: " + response.statusText);
    }



  }).catch(function (error) {
    displayError("Unable to connect to OpenWeather. Please check your internet connection.");
  });
}

function displayWeather(name, weatherData) {
  var tempHTML = "<div class='card'><div class='card-body'>";
  var date = moment.unix(weatherData.current.dt).format("M/D/YYYY");
  tempHTML += "<h2 class='card-title'>" + name + " (" + date + ") ";
  tempHTML += "<img src='https://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + ".png' alt='" + weatherData.current.weather[0].description + "' /></h3>";
  tempHTML += "<p class='card-text'>Temperature: " + weatherData.current.temp + " &deg;F</p>";
  tempHTML += "<p class='card-text'>Humidity: " + weatherData.current.humidity + "%</p>";
  tempHTML += "<p class='card-text'>Wind Speed: " + weatherData.current.wind_speed + " MPH</p>";
  tempHTML += "<p class='card-text'>UV Index: <span class='badge ";



  if (weatherData.current.uvi < 3) {
    tempHTML += "low-uv text-light";
  } else if (weatherData.current.uvi < 6) {
    tempHTML += "moderate-uv text-dark";
  } else if (weatherData.current.uvi < 8) {
    tempHTML += "high-uv text-dark";
  } else if (weatherData.current.uvi < 11) {
    tempHTML += "very-high-uv text-light";
  } else {
    tempHTML += "extreme-uv text-light";
  }
  tempHTML += "'>" + weatherData.current.uvi + "</span></p>";

  // close the current weather card
  tempHTML += "</div></div>";

  // create a div for the forecast

  tempHTML += "<div class='forecast'><h3>5-Day Forecast:</h3>";
  // bootstrap grid doesn't have the divisions we want for 5 items, just use a regular flexbox
  tempHTML += "<div class='d-md-flex justify-content-between'>";

  // loop through the days, current day is 0 and can be skipped
  for (var i = 1; i < 6; i++) {
    date = moment.unix(weatherData.daily[i].dt).format("M/D/YYYY");
    tempHTML += "<div class='card bg-primary text-white flex-grow-1'><div class='card-body'>";
    tempHTML += "<h4 class='card-title'>" + date + "</h4>";
    tempHTML += "<img src='https://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + "@2x.png' alt='" + weatherData.daily[i].weather[0].description + "' />";
    tempHTML += "<p class='card-text'>Temp: " + weatherData.daily[i].temp.day + " &deg;F</p>";
    tempHTML += "<p class='card-text'>Humidity: " + weatherData.daily[i].humidity + "%</p>";
    tempHTML += "</div></div>";
  }
  tempHTML += "</div></div>";
  weatherEl.innerHTML = tempHTML;
}



function displayError(errMsg) {
  weatherEl.innerHTML = "<p class='alert alert-danger'>" + errMsg + "</p>";
}



document.getElementById("search-btn").addEventListener("click", function (event) {
  event.preventDefault();
  var city = cityInputEl.value;
  getWeatherCoords(city);
  saveCity(city);
});



$("#search-history").on("click", "li", function () {
  getWeatherCoords(this.innerHTML);
});



displayCities();