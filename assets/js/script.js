// Constants
const API_SERVER = "http://api.openweathermap.org/";
const API_WEATHER_END_POINT = "data/2.5/weather";
const API_ONECALL_END_POINT = "data/2.5/onecall";
const API_KEY = "9dc0ecf3100ca1f98d7b3462ccb6b3df";
const FORECAST_DAYS = 5; // 1 - 7
const searchBtn = $("#searchButton");

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
  nextFiveDays: [],
};

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

// Get search by city
function getSearchByCity() {
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

// Get weather icon
function getWeatherIcon(icon) {
  //
  var iconURL = "http://openweathermap.org/img/wn/" + icon + ".png";
  return iconURL;
  //
}

// Render weather data
function renderWeatherData(data) {
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
function renderForecastData(data) {
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
    spanEl.text(cityWeather.nextFiveDays[i].date);
    spanEl.appendTo(dayDiv);
    //
    // Icon
    //
    spanEl = $("<span>");
    iconEl = $("<img>");
    iconEl.addClass("text-white");
    iconEl.attr("src", getWeatherIcon(cityWeather.nextFiveDays[i].weatherIcon));
    iconEl.attr("alt", cityWeather.nextFiveDays[i].weatherDescription);
    // iconEl.attr("data-bs-toggle", "tooltip");
    // iconEl.attr("data-bs-placement", "right");
    // iconEl.attr("data-bs-html", "true");
    // iconEl.attr("title", cityWeather.nextFiveDays[i].weatherDescription);
    iconEl.appendTo(spanEl);
    //
    tooltipEl = $("<span>");
    tooltipEl.addClass("h6 text-capitalize font-italic");
    tooltipEl.text(cityWeather.nextFiveDays[i].weatherDescription);
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
    innerSpanEl.text(cityWeather.nextFiveDays[i].temperature + " °F");
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
    innerSpanEl.text(cityWeather.nextFiveDays[i].wind + " MPH");
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
    innerSpanEl.text(cityWeather.nextFiveDays[i].humidity + " %");
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
    innerSpanEl.text(cityWeather.nextFiveDays[i].uvIndex);
    //
    // https://www.epa.gov/sunsafety/uv-index-scale-0
    //
    if (cityWeather.nextFiveDays[i].uvIndex <= 2) {
      //
      innerSpanEl.addClass("badge bg-success text-white px-3");
      //
    } else if (cityWeather.nextFiveDays[i].uvIndex <= 7) {
      //
      innerSpanEl.addClass("badge bg-warning text-dark px-3");
      //
    } else if (cityWeather.nextFiveDays[i].uvIndex >= 8) {
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
function getCoordinates() {
  //
  var searchCity = getSearchByCity();
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
      cityWeather.weatherIcon = data.current.weather[0].icon;
      cityWeather.weatherDescription = data.current.weather[0].main;
      cityWeather.temperature = data.current.temp;
      cityWeather.wind = data.current.wind_speed;
      cityWeather.humidity = data.current.humidity;
      cityWeather.uvIndex = data.current.uvi;
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
        cityWeather.nextFiveDays.push(dailyForecast);
        //
      }
      //
      renderWeatherData(data);
      renderForecastData(data);
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

// Initialize dashbaord
function initializeDashboard() {
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
    nextFiveDays: [],
  };
  //
}

// Event listeners
searchBtn.on("click", function () {
  //
  event.preventDefault();
  initializeDashboard();
  getCoordinates();
  //
});

// Rock & Roll
initializeDashboard();
getCoordinates();
//
