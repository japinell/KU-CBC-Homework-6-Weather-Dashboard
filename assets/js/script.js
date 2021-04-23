// Constants
const API_SERVER = "https://api.openweathermap.org/";
const API_WEATHER_END_POINT = "data/2.5/weather";
const API_ONECALL_END_POINT = "data/2.5/onecall";
const API_KEY = "9dc0ecf3100ca1f98d7b3462ccb6b3df";
const FORECAST_DAYS = 5; // 1 - 7
const searchBtn = $("#searchButton");
const lastSearchCitiesDiv = $("#last-searches");
// Variables
var today = dayjs();
var todayText = dayjs().format("MM/DD/YYYY");
var cityWeather = {
  date: "",
  cityName: "",
  latitude: "",
  longitude: "",
  weatherIcon: "",
  weatherDescription: "",
  temperature: "",
  wind: "",
  humidity: "",
  uvIndex: "",
  fiveDaysForecast: [],
};
var lastSearch = {
  cityName: "",
  latitude: "",
  longitude: "",
};
var lastSearchCities = []; // Stores an array of lastSearch objects

//
$("#todayDate").text(todayText);

// Show message
function showMessage(message) {
  //
  var pEl = $("#statusMessage");
  pEl.addClass("text-danger").text(message);
  pEl.text(message);
  //
  // Wait 1.5 seconds
  //
  setTimeout(function () {
    //
    pEl.text("");
    //
  }, 3000);
  //
}

// Get weather icon
function getWeatherIcon(icon) {
  //
  var iconURL = "http://openweathermap.org/img/wn/" + icon + ".png";
  return iconURL;
  //
}

// Render weather data
function renderWeatherData() {
  //
  var weatherDiv = $("#weather");
  var spanEl, innerSpanEl, iconEl, tooltipEl, dayDiv;
  //
  // Today's forecast
  //
  weatherDiv.empty();
  //
  dayDiv = $("<div>");
  dayDiv.addClass("card p-3 card-custom");
  //   dayDiv.addClass("col-12 card p-3 card-custom");
  //
  // City
  //
  spanEl = $("<span>");
  spanEl.addClass("col-12 h4 text-center");
  spanEl.text(cityWeather.cityName);
  //
  // Icon
  //
  innerSpanEl = $("<span>");
  iconEl = $("<img>");
  iconEl.addClass("text-white");
  iconEl.attr("src", getWeatherIcon(cityWeather.weatherIcon));
  iconEl.attr("alt", cityWeather.weatherDescription);
  //   iconEl.attr("data-bs-toggle", "tooltip");
  //   iconEl.attr("data-bs-placement", "right");
  //   iconEl.attr("data-bs-html", "true");
  //   iconEl.attr("title", cityWeather.weatherDescription);
  iconEl.appendTo(innerSpanEl);
  //
  tooltipEl = $("<span>");
  tooltipEl.addClass("h6 text-capitalize font-italic");
  tooltipEl.text(cityWeather.weatherDescription);
  tooltipEl.appendTo(innerSpanEl);
  //
  innerSpanEl.appendTo(spanEl);
  //
  spanEl.appendTo(dayDiv);
  //
  // Temperature
  //
  spanEl = $("<span>");
  spanEl.addClass("col-12 h5");
  spanEl.text("Temperature: ");
  //
  innerSpanEl = $("<span>");
  innerSpanEl.text(cityWeather.temperature + " °F");
  innerSpanEl.appendTo(spanEl);
  //
  spanEl.appendTo(dayDiv);
  //
  // Wind speed
  //
  spanEl = $("<span>");
  spanEl.addClass("col-12 h5");
  spanEl.text("Wind: ");
  //
  innerSpanEl = $("<span>");
  innerSpanEl.text(cityWeather.wind + " MPH");
  innerSpanEl.appendTo(spanEl);
  //
  spanEl.appendTo(dayDiv);
  //
  // Humidity
  //
  spanEl = $("<span>");
  spanEl.addClass("col-12 h5");
  spanEl.text("Humidity: ");
  //
  innerSpanEl = $("<span>");
  innerSpanEl.text(cityWeather.humidity + " %");
  innerSpanEl.appendTo(spanEl);
  //
  spanEl.appendTo(dayDiv);
  //
  // UV Index
  //
  spanEl = $("<span>");
  spanEl.addClass("col-12 h5");
  spanEl.text("UV Index: ");
  //
  innerSpanEl = $("<span>");
  innerSpanEl.text(cityWeather.uvIndex);
  //
  // https://www.epa.gov/sunsafety/uv-index-scale-0
  //
  if (cityWeather.uvIndex <= 2) {
    //
    innerSpanEl.addClass("badge bg-success text-white px-4");
    //
  } else if (cityWeather.uvIndex <= 7) {
    //
    innerSpanEl.addClass("badge bg-warning text-dark px-4");
    //
  } else if (cityWeather.uvIndex >= 8) {
    //
    innerSpanEl.addClass("badge bg-danger text-white px-4");
    //
  }
  //
  innerSpanEl.appendTo(spanEl);
  //
  spanEl.appendTo(dayDiv);
  //
  dayDiv.appendTo(weatherDiv);
  //
}

// Render forecast data
function renderForecastData() {
  //
  var forecastDiv = $("#forecast");
  var spanEl, innerSpanEl, iconEl, tooltipEl, dayDiv;
  //
  // Next five day's forecast (Day 1)
  //
  forecastDiv.empty();
  //
  dayDiv = $("<div>");
  dayDiv.addClass("col-12 h4 d-block text-center");
  dayDiv.text(FORECAST_DAYS + "-Day Forecast:");
  dayDiv.appendTo(forecastDiv);
  //
  for (var i = 0; i < FORECAST_DAYS; i++) {
    //
    dayDiv = $("<div>");
    dayDiv.addClass("card p-3 card-custom");
    //
    // Date
    //
    spanEl = $("<span>");
    spanEl.addClass("d-block");
    spanEl.text(cityWeather.fiveDaysForecast[i].date);
    spanEl.appendTo(dayDiv);
    //
    // Icon
    //
    spanEl = $("<span>");
    iconEl = $("<img>");
    iconEl.addClass("text-white");
    iconEl.attr(
      "src",
      getWeatherIcon(cityWeather.fiveDaysForecast[i].weatherIcon)
    );
    iconEl.attr("alt", cityWeather.fiveDaysForecast[i].weatherDescription);
    // iconEl.attr("data-bs-toggle", "tooltip");
    // iconEl.attr("data-bs-placement", "right");
    // iconEl.attr("data-bs-html", "true");
    // iconEl.attr("title", cityWeather.fiveDaysForecast[i].weatherDescription);
    iconEl.appendTo(spanEl);
    //
    tooltipEl = $("<span>");
    tooltipEl.addClass("h6 text-capitalize font-italic");
    tooltipEl.text(cityWeather.fiveDaysForecast[i].weatherDescription);
    tooltipEl.appendTo(spanEl);
    //
    spanEl.appendTo(dayDiv);
    //
    // Temperature
    //
    spanEl = $("<span>");
    spanEl.addClass("d-block");
    spanEl.text("Temperature: ");
    //
    innerSpanEl = $("<span>");
    innerSpanEl.text(cityWeather.fiveDaysForecast[i].temperature + " °F");
    innerSpanEl.appendTo(spanEl);
    //
    spanEl.appendTo(dayDiv);
    //
    // Wind speed
    //
    spanEl = $("<span>");
    spanEl.addClass("d-block");
    spanEl.text("Wind: ");
    //
    innerSpanEl = $("<span>");
    innerSpanEl.text(cityWeather.fiveDaysForecast[i].wind + " MPH");
    innerSpanEl.appendTo(spanEl);
    //
    spanEl.appendTo(dayDiv);
    //
    // Humidity
    //
    spanEl = $("<span>");
    spanEl.addClass("d-block");
    spanEl.text("Humidity: ");
    //
    innerSpanEl = $("<span>");
    innerSpanEl.text(cityWeather.fiveDaysForecast[i].humidity + " %");
    innerSpanEl.appendTo(spanEl);
    //
    spanEl.appendTo(dayDiv);
    //
    // UV Index
    //
    spanEl = $("<span>");
    spanEl.addClass("d-block");
    spanEl.text("UV Index: ");
    //
    innerSpanEl = $("<span>");
    innerSpanEl.text(cityWeather.fiveDaysForecast[i].uvIndex);
    //
    // https://www.epa.gov/sunsafety/uv-index-scale-0
    //
    if (cityWeather.fiveDaysForecast[i].uvIndex <= 2) {
      //
      innerSpanEl.addClass("badge bg-success text-white px-3");
      //
    } else if (cityWeather.fiveDaysForecast[i].uvIndex <= 7) {
      //
      innerSpanEl.addClass("badge bg-warning text-dark px-3");
      //
    } else if (cityWeather.fiveDaysForecast[i].uvIndex > 7) {
      //
      innerSpanEl.addClass("badge bg-danger text-white px-3");
      //
    }
    innerSpanEl.appendTo(spanEl);
    //
    spanEl.appendTo(dayDiv);
    //
    dayDiv.appendTo(forecastDiv);
    //
  }
  //
}

// Get latitude/longitude coordinates
function getCoordinates(searchCity) {
  //
  var apiURL =
    API_SERVER +
    API_WEATHER_END_POINT +
    "?q=" +
    searchCity +
    "&appid=" +
    API_KEY;
  //
  fetch(apiURL)
    //
    .then(function (response) {
      //
      if (response.ok) {
        //
        return response.json();
        //
      } else {
        //
        // Handle no response error
        //
        showMessage("Could not retrieve any data");
        //
      }
      //
    })
    .then(function (data) {
      //
      // Clear the cityWeather object
      //
      cityWeather = {
        date: "",
        cityName: "",
        latitude: "",
        longitude: "",
        weatherIcon: "",
        weatherDescription: "",
        temperature: "",
        wind: "",
        humidity: "",
        uvIndex: "",
        fiveDaysForecast: [],
      };
      //
      // Store city data
      //
      cityWeather.date = todayText;
      cityWeather.cityName = data.name;
      cityWeather.latitude = data.coord.lat;
      cityWeather.longitude = data.coord.lon;
      //
      getWeatherData();
      //
    })
    .catch(function (error) {
      //
      // Handle other errors
      //
      showMessage(`Error: ${error}`);
      //
    });
  //
}

// Get weather data
function getWeatherData() {
  //
  var apiURL =
    API_SERVER +
    API_ONECALL_END_POINT +
    "?lat=" +
    cityWeather.latitude +
    "&lon=" +
    cityWeather.longitude +
    "&units=imperial&exclude=minutely,hourly,alerts" +
    "&appid=" +
    API_KEY;
  //
  fetch(apiURL)
    //
    .then(function (response) {
      //
      if (response.ok) {
        //
        return response.json();
        //
      } else {
        //
        // Handle no response error
        //
        showMessage("Could not retrieve any data");
        //
      }
      //
    })
    .then(function (data) {
      //
      var day = dayjs();
      var dailyForecast = {
        date: "",
        weatherIcon: "",
        weatherDescription: "",
        temperature: "",
        wind: "",
        humidity: "",
        uvIndex: "",
      };
      //
      // Store weather/forecast data
      //
      cityWeather.weatherIcon = data.current.weather[0].icon;
      cityWeather.weatherDescription = data.current.weather[0].main;
      cityWeather.temperature = data.current.temp;
      cityWeather.wind = data.current.wind_speed;
      cityWeather.humidity = data.current.humidity;
      cityWeather.uvIndex = data.current.uvi;
      //
      // Clear the forecast array
      //
      cityWeather.fiveDaysForecast = [];
      //
      for (var i = 0; i < FORECAST_DAYS; i++) {
        //
        day = day.add(1, "d");
        dailyForecast = {
          date: day.format("MM/DD/YYYY"),
          weatherIcon: data.daily[i].weather[0].icon,
          weatherDescription: data.daily[i].weather[0].main,
          temperature: data.daily[i].temp.max,
          wind: data.daily[i].wind_speed,
          humidity: data.daily[i].humidity,
          uvIndex: data.daily[i].uvi,
        };
        //
        cityWeather.fiveDaysForecast.push(dailyForecast);
        //
      }
      //
      renderWeatherData();
      renderForecastData();
      saveLastSearchCities();
      renderLastSearchButtons();
      //
    })
    .catch(function (error) {
      //
      // Handle other errors
      //
      showMessage(`Error: ${error}`);
      //
    });
  //
}

// Set last search cities to localStorage
function saveLastSearchCities() {
  //
  var index = isLastSearchAlreadyStored();
  //
  if (index < 0) {
    // Insert it
    lastSearch = {
      cityName: cityWeather.cityName,
      latitude: cityWeather.latitude,
      longitude: cityWeather.longitude,
    };
    //
    lastSearchCities.push(lastSearch);
    localStorage.setItem("lastSearchCities", JSON.stringify(lastSearchCities));
    //
  }
}

// Get lastSearchCities from localStorage
function retrieveLastSearchCities() {
  //
  var savedSearches = JSON.parse(localStorage.getItem("lastSearchCities"));
  //
  if (savedSearches != null) {
    //
    lastSearchCities = savedSearches;
    //
  }
  //
}

// Check if the item is already in the lastSearchCities array
function isLastSearchAlreadyStored() {
  //
  // If found, returns the array index; otherwise, -1
  //
  var index = -1;
  //
  if (lastSearchCities != null) {
    //
    for (var i = 0, l = lastSearchCities.length; i < l; i++) {
      //
      if (lastSearchCities[i].cityName === cityWeather.cityName) {
        index = i;
        break;
      }
      //
    }
    //
  }
  //
  return index;
  //
}

// Render last search buttons
function renderLastSearchButtons() {
  //
  var buttonEl;
  //
  lastSearchCitiesDiv.empty();
  //
  for (var i = 0, l = lastSearchCities.length; i < l; i++) {
    //
    buttonEl = $("<button>");
    buttonEl.attr("cityName", lastSearchCities[i].cityName);
    buttonEl.attr("latitude", lastSearchCities[i].latitude);
    buttonEl.attr("longitude", lastSearchCities[i].longitude);
    buttonEl.addClass("btn btn-link text-white");
    buttonEl.text(lastSearchCities[i].cityName);
    //
    buttonEl.appendTo(lastSearchCitiesDiv);
    //
  }
  //
}

// Get city by means of the search button
function getCityBySearch() {
  //
  var searchString = $("#searchText").val().trim();
  //
  if (searchString === "") {
    //
    searchString = "Overland Park,KS,US"; // Default
    //
  }
  //
  return searchString;
  //
}

// Get city by means of selection
function getCityBySelection() {
  //
  cityWeather.date = todayText;
  cityWeather.cityName = $(this).attr("cityName");
  cityWeather.latitude = $(this).attr("latitude");
  cityWeather.longitude = $(this).attr("longitude");
  //
  $("#searchText").val(cityWeather.cityName);
  //
  getWeatherData();
  //
}

// Initialize parameters
function initializeParameters() {
  //
  retrieveLastSearchCities();
  //
  if (lastSearchCities.length > 0) {
    //
    // Get weather data for the first city in the lastSearchCities array
    //
    cityWeather.date = todayText;
    cityWeather.cityName = lastSearchCities[0].cityName;
    cityWeather.latitude = lastSearchCities[0].latitude;
    cityWeather.longitude = lastSearchCities[0].longitude;
    //
    getWeatherData();
    //
  } else {
    //
    // Get "local" weather data
    // TODO: retrieve the actual city
    //
    var searchCity = "Overland Park,KS,US";
    //
    getCoordinates(searchCity);
    //
  }
  //
}

// Event listeners
searchBtn.on("click", function () {
  //
  event.preventDefault();
  //
  var searchCity = getCityBySearch();
  //
  getCoordinates(searchCity);
  saveLastSearchCities();
  renderLastSearchButtons();
  //
});

lastSearchCitiesDiv.on("click", "button", getCityBySelection);

// Rock & Roll
initializeParameters();
//
