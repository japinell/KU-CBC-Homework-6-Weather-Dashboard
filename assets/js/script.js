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
  var cityText = $("#cityText");
  var iconURL = $("<img>");
  var weatherTemp = $("#weatherTemperature");
  var weatherWind = $("#weatherWind");
  var weatherHumidity = $("#weatherHumidity");
  var weatherUVIndex = $("#weatherUVIndex");
  //
  cityText.text(cityWeather.cityName);
  iconURL.attr("src", getWeatherIcon(cityWeather.weatherIcon));
  iconURL.attr("alt", cityWeather.weatherDescription);
  iconURL.appendTo(cityText);
  //
  weatherTemp.text(cityWeather.temperature);
  weatherWind.text(cityWeather.wind);
  weatherHumidity.text(cityWeather.humidity);
  weatherUVIndex.text(cityWeather.uvIndex);
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
      console.log(cityWeather);
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
  //getWeatherData();
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
