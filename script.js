const apiURL = "https://fcc-weather-api.glitch.me/";
const celsius = "&#8451";
const fehrenheit = "&#8457";

let currentTempUnit = celsius;
let tempValue = 0;
let maxTempValue = 0;
let minTempValue = 0;

let cityName = $("#cityName");
let countryName = $("#countryName");
let temprature = $("#temprature");
let weatherTitle = $("#weather-Title");
let weatherDescription = $("#weather-Description");
let maxTemp = $("#max-Temp");
let minTemp = $("#min-Temp");
let humidity = $("#humidity");
let weatherIcon = $("#weather-Icon");

//Possible Weather conditions and corresponding background images
const weatherConditions = {
  drizzle:
    "https://res.cloudinary.com/orionrenegado/image/upload/v1526682002/WeatherApp/drizzle.jpg",
  clouds:
    "https://res.cloudinary.com/orionrenegado/image/upload/v1526681729/WeatherApp/clouds.png",
  rain:
    "https://res.cloudinary.com/orionrenegado/image/upload/v1526681572/WeatherApp/rain.jpg",
  snow:
    "https://res.cloudinary.com/orionrenegado/image/upload/v1526682093/WeatherApp/snow.jpg",
  clear:
    "https://res.cloudinary.com/orionrenegado/image/upload/v1526682526/WeatherApp/clear.png",
  thunderstorm:
    "https://res.cloudinary.com/orionrenegado/image/upload/v1526682622/WeatherApp/thunderstorm.jpg",
  haze:
    "https://res.cloudinary.com/orionrenegado/image/upload/v1526724871/WeatherApp/haze.png",
  dust:
    "https://res.cloudinary.com/orionrenegado/image/upload/v1526808023/WeatherApp/dust.png",
  defaultWeather:
    "https://res.cloudinary.com/orionrenegado/image/upload/v1526682766/WeatherApp/default.jpg"
};

//FUNCTIONS
//Changes background dynamically based on the Weather Condition
const changeBackground = function(weatherTitle) {
  if (weatherConditions.hasOwnProperty(weatherTitle)) {
    $("body").css(
      "background",
      "url(" +
        weatherConditions[weatherTitle] +
        ") no-repeat center center fixed"
    );
  } else {
    $("body").css(
      "background",
      "url(" +
        weatherConditions.defaultWeather +
        ") no-repeat center center fixed"
    );
  }
};

//Retrieves json data from Weather api
const getWeatherJson = function(longitude, latitude) {
  let requestURL = apiURL + "api/current?" + "lat=" + latitude + "&lon=" + longitude;

  let request = new XMLHttpRequest();
  request.open('GET',requestURL);
  request.responseType = 'json';
  request.send();
  request.onload = function() {
    displayWeather(request.response);
  }
  
  //$.getJSON(requestURL, json => {
  //  displayWeather(json);
 // });
};

//Switches fehrenheit to celsius & vice-versa along with button text and unit symbol
const changeUnit = function() {
  if (currentTempUnit == celsius) {
    currentTempUnit = fehrenheit;
    tempValue = Math.round(tempValue * (9 / 5) + 32);
    maxTempValue = Math.round(maxTempValue * (9 / 5) + 32);
    minTempValue = Math.round(minTempValue * (9 / 5) + 32);
    $("#btnUnitChange").text("Switch to Celsius");
  } else {
    currentTempUnit = celsius;
    tempValue = Math.round((tempValue - 32) * (5 / 9));
    maxTempValue = Math.round((maxTempValue - 32) * (5 / 9));
    minTempValue = Math.round((minTempValue - 32) * (5 / 9));
    $("#btnUnitChange").text("Switch to Fahrenheit");
  }

  temprature.html(tempValue + "<small>" + currentTempUnit + "</small>");
  maxTemp.html(maxTempValue + currentTempUnit);
  minTemp.html(minTempValue + currentTempUnit);
};

//Displays data on the page
const displayWeather = function(weatherData) {
  tempValue = weatherData.main.temp;
  maxTempValue = weatherData.main.temp_max;
  minTempValue = weatherData.main.temp_min;

  cityName.text(weatherData.name);
  countryName.text(weatherData.sys.country);
  weatherTitle.text(weatherData.weather[0].main);
  weatherDescription.text(weatherData.weather[0].description);
  humidity.text(weatherData.main.humidity + "%");

  temprature.html(tempValue + "<small>" + currentTempUnit + "</small>");
  maxTemp.html(maxTempValue + currentTempUnit);
  minTemp.html(minTempValue + currentTempUnit);
  weatherIcon.attr("src", weatherData.weather[0].icon);
  weatherTitle.append(weatherIcon);
  changeBackground(weatherData.weather[0].main.toLowerCase());
};

//Entry point of the Application
$("document").ready(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      let longitude = Math.round(position.coords.longitude);
      let latitude = Math.round(position.coords.latitude);
      getWeatherJson(longitude, latitude);
    });
  } else {
    $(document).text(
      '<h2 class="display-4"> Sorry Weather app not supported in your browser</h2>'
    );
  }

  $("#btnUnitChange").click(changeUnit);
});
