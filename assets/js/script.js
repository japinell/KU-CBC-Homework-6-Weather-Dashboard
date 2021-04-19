// Constants
const API_SERVER = "http://api.openweathermap.org/";
const API_WEATHER_END_POINT = "data/2.5/weather";
const API_ONECALL_END_POINT = "data/2.5/onecall";
const API_KEY = "9dc0ecf3100ca1f98d7b3462ccb6b3df";
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

// Show message
function showMessage(message) {
  //
  var pEl = $("#statusMessage");
  //pEl.addClass("text-success").text(message);
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
  var forecastDiv = $("#forecast");
  var spanEl, innerSpanEl, iconEl, dayDiv;
  //
  // Today's forecast
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
  iconEl.appendTo(innerSpanEl);
  innerSpanEl.appendTo(spanEl);
  //
  spanEl.appendTo(weatherDiv);
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
  spanEl.appendTo(weatherDiv);
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
  spanEl.appendTo(weatherDiv);
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
  spanEl.appendTo(weatherDiv);
  //
  // UV Index
  //
  spanEl = $("<span>");
  spanEl.addClass("col-12 h5");
  spanEl.text("UV Index: ");
  //
  innerSpanEl = $("<span>");
  innerSpanEl.text(cityWeather.uvIndex);
  innerSpanEl.appendTo(spanEl);
  //
  spanEl.appendTo(weatherDiv);
  //
  // Next five day's forecast (Day 1)
  //
  forecastDiv.empty();
  //
  dayDiv = $("<div>");
  dayDiv.addClass("col-12 h4 d-block text-centered");
  dayDiv.text("5-Day Forecast:");
  dayDiv.appendTo(forecastDiv);
  //
  for (var i = 0; i < 5; i++) {
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
    iconEl.appendTo(spanEl);
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
      cityWeather.weatherDescription = data.current.weather[0].description;
      cityWeather.temperature = data.current.temp;
      cityWeather.wind = data.current.wind_speed;
      cityWeather.humidity = data.current.humidity;
      cityWeather.uvIndex = data.current.uvi;
      //
      for (var i = 0; i < 5; i++) {
        //
        day = day.add(1, "d");
        dailyForecast = {
          date: day.format("MM/DD/YYYY"),
          weatherIcon: data.daily[i].weather[0].icon,
          weatherDescription: data.daily[i].weather[0].description,
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
  $("#todayDate").text(todayText);
  //
  getCoordinates();
  //
}

// Event listeners
searchBtn.on("click", function () {
  //
  event.preventDefault();
  getCoordinates();
  //
});

// Rock & Roll
initializeDashboard();
