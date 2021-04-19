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
  var cityText;
  var iconEl;
  var weatherIcon;
  var weatherTemp;
  var weatherWind;
  var weatherHumidity;
  var weatherUVIndex;
  var dateText;
  var weatherDate;
  //
  var forecastDiv = $("#forecast");
  //
  // Today's forecast
  //
  cityText = $("#cityText");
  weatherTemp = $("#weatherTemperature");
  weatherWind = $("#weatherWind");
  weatherHumidity = $("#weatherHumidity");
  weatherUVIndex = $("#weatherUVIndex");
  //
  cityText.text(cityWeather.cityName);
  iconEl = $("<img>");
  iconEl.attr("src", getWeatherIcon(cityWeather.weatherIcon));
  iconEl.attr("alt", cityWeather.weatherDescription);
  iconEl.appendTo(cityText);
  //
  weatherTemp.text(cityWeather.temperature);
  weatherWind.text(cityWeather.wind);
  weatherHumidity.text(cityWeather.humidity);
  weatherUVIndex.text(cityWeather.uvIndex);
  //
  // Next five day's forecast (Day 1)
  //
  weatherDate = $("#forecastDate1");
  weatherIcon = $("#forecastIcon1");
  weatherTemp = $("#forecastTemperature1");
  weatherWind = $("#forecastWind1");
  weatherHumidity = $("#forecastHumidity1");
  weatherUVIndex = $("#forecastUVIndex1");
  //
  console.log(cityWeather);
  //
  weatherDate.text(cityWeather.nextFiveDays[0].date);
  //
  iconEl = $("<img>");
  iconEl.attr("src", getWeatherIcon(cityWeather.nextFiveDays[0].weatherIcon));
  iconEl.attr("alt", cityWeather.nextFiveDays[0].weatherDescription);
  iconEl.appendTo(weatherIcon);
  //
  weatherTemp.text(cityWeather.nextFiveDays[0].temperature);
  weatherWind.text(cityWeather.nextFiveDays[0].wind);
  weatherHumidity.text(cityWeather.nextFiveDays[0].humidity);
  weatherUVIndex.text(cityWeather.nextFiveDays[0].uvIndex);
  //
  // Day 2
  //
  for (var i = 1; i < 2; i++) {
    //
    //
  }
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
