var searchHistory = [];
var weatherApiRootUr1 = 'https://api.openweathermap.org';
var weatherAPIKey = "17fc5aec12f64758ad803eb5538adc56";

//Dom element references
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayContainer = document.querySelector('#today');
var forecastContainer = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');

//Add timezone plugins to day.js

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_pluging_timezone);

//Function to display the search history list

function renderSearchHistory() {
    searchHistoryContainer.innerHTML = '';

//Start at end of history array and count down to show the most recent at the top
for(var i = searchHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('history-btn', 'btn-history');

    //Data-Search allows access to city name when click handler is invoked
    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.append(btn);
}
}
//Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
//If there is no search term return the function
if (searchHistory.indexOf(search) !== -1) {
    return;
}
searchHistory.push(search);

localStorage.setItem('search-history', JSON.stringify(searchHistory));
renderSearchHistory();
}
//Function to get search history from local storage
function initSearchHistory() {
    var storedHistory = localStorage.getItem('search-History');
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
}   

//Function to display the current weather data fetcheed from OpenWeather api
function renderCurrentWeather(city, weather) {
    var date = dayjs().format('M/D/YYYY');

//Store response data from our fetch request in variables
var tempF = weather.main.temp;
var windMph = weather.wind.speed;
var humidity = weather.main.humidity;
var iconUr1 = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
var iconDescription = weather.weather[0].description || weather[0].main;

var card = document.createElement('div');
var cardBody = document.createElement('div');
var heading =  document.createElement('h2');
var weatherIcon = document.createElement('img');
var tempE1 = document.createElement('p');
var windE1 = document.createElement('p');
var humidityE1 = document.createElement('p');

card.setAttribute('class', 'card');
cardBody.setAttribute('class', 'card-body');
card.append(cardBody);

heading.setAttribute('class', 'h3 card-title');
tempE1.setAttribute('class', 'card-text');
windE1.setAttribute('class', 'card-text');
humidityE1.setAttribute('class', 'card-text');

heading.textContent = `${city} (${date})`;
weatherIcon.setAttribute('src', iconUrl);
weatherIcon.setAttribute('alt', iconDescription);
weatherIcon.setAttribute('class', 'weather-img');
heading.append(weatherIcon);
tempE1.textContent = `Temp: ${tempF}°F`;
windE1.textContent = `Wind: ${windMph} MPH`;
humidityE1.textContent = `Humidity: ${humidity} %`;
cardBody.append(heading, tempE1, windE1, humidityE1);

todayContainer.innerHTML = '';
todayContainer.append(card);
}

//Function to display a forecast card given on object from open weather api 
//daily forecast.

function renderForecastCard(forecast) {
// variables for data from api
var iconUr1 = `https:openweathermap.org/img/w/${forecast.weather[0].icon}.png`
var iconDescription = forecast.weather[0].description;
var tempE1 = forecast.main.temp;
var humidity = forecast.main.humidity;
var windMph = forecast.wind.speed;

//Create elements for a card
var co1 = document.createElement.apply('div');
var card = document.createElement('div');
var cardBody = document.createElement('div');
var cardTitle = document.createElement('h5');
var weatherIcon = document.createElement('img');
var tempE1 = document.createElement('p');
var windE1 = document.createElement('p');
var humidityE1 = document.createElement('p');

col.append(card);
card.append(cardBody);
cardBody.append(cardTitle, weatherIcon, tempE1, windE1, humidityE1);

col.setAttribute('class', 'col-md');
col.classList.add('five-day-card');
card.setAttribute('class', 'card bg-primary h-100 text-white');
cardBody.setAttribute('class', 'card-body p-2');
cardTitle.setAttribute('class', 'card-title');
tempE1.setAttribute('class', 'card-text');
windE1.setAttribute('class', 'card-text');
humidityE1.setAttribute('class', 'card-text');

//Add content to elements
cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
weatherIcon.setAttribute('src', iconUr1);
weatherIcon.setAttribute('alt', iconDescription);
tempE1.textContent = `Temp: ${tempF} °F`;
windE1.textContent = `Wind: ${windMph} MPH`;
humidityE1.textContent = `Humidity: ${humidity} %`;

forecastContainer.append(col);
}

//Function to display 5 day forecast.
function renderForecast(dailyForecast) {

//Create unix timestamps for start and end of 5 day forecast
var startDt = dayjs().add(1, 'day').startOf('day').unix();
var endDt = dayjs().add(6, 'day').startOf('day').unix();

var headingCo1 = document.createElement('div');
var heading = document.createElement('h4');

headingCo1.setAttribute('class', 'col-12');
heading.textContent = '5-Day Forecast:';
headingCo1.append(heading);

forecastContainer.innerHTML = '';
forecastContainer.append(headingCo1);

for (var i = 0; i < dailyForecast.length; i++) {

//First filters through all of the data and returns only data that falls between one day after the current data and up to 5 days later.
if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt <endDt) {

//Then filters through the data and returns only data captured at noon of each day
if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
    renderForecastCard(dailyForecast[i]);
}
}
}
}

function renderItems(city, data) {
    renderCurrentWeather(city, data.list[0], data.city.timezone);
    renderForecast(data.list);
}

//Fetches weather data for given location form the weather geolocation
//endpoint; then, calls functions to display current and forecast weather data.
function fetchWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;

    var apiUr1 = `${weatherApiRootUr1}/data/2.5/forecast?lat=${lat}&long=${lon}&units=imperial&appid=${weatherApiKey}`;

    fetch(apiUr1)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            renderItems(city, data);
        })
        .catch(function (err) {
            console.error(err);
        });
    }

function fetchCoords(search) {
    var apiUr1 =`${weatherApiRootUr1}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;

    fetch(apiUr1)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (!data[0]) {
                alert('location not found');            
            } else {
                appendToHistory(search);
                fetchWeather(data[0]);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

function handleSearchFormSubmit(e) {
  //Don't continue if there is nothing in the search form
  if (!searchInput.value) {
    return;
  }
e.preventDefault();
var search = serachInput.value.trim();
fetchCoords(search);
searchInput.value = '';
}

function handleSearchHistoryClick(e) {
    //Don't do search if current elements is not a search history button
    if (!e.target.matches('.btn-history')) {
        return;  
    }

    var btn = e.target;
    var search = btn.getAttribute('data-search');
    fetchCoords(search);
}

initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);
