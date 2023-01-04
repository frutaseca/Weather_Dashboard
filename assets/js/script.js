// api key
var apiKey = '7d1b285353ccacd5326159e04cfab063';
// varibles
var cityInput = document.querySelector("#city-input");
var searchForm = document.querySelector("#search-form");
var searchedcities = document.querySelector("#searched-cities");
var currentWeather = document.querySelector("#current-weather");
var fiveDayWeather = document.querySelector("#five-day-weather");
var searchHistory = [];

function home(event) {
    event.preventDefault();
    var cityName = cityInput.value;
    weather(cityName);
}
// shows current weather of city
function weather(cityName) {
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=` + apiKey +`&units=imperial`;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (currentData) {
            console.log(currentData);
            // gets five day data
            var APICall = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=` + apiKey +`&units=imperial`;
            fetch(APICall)
                .then(function (response) {
                    return response.json();
                })
                .then(function (fiveDayData) {
                    if (searchHistory.includes(currentData.name) === false) {
                        searchHistory.push(currentData.name);
                        localStorage.setItem("city", JSON.stringify(searchHistory));
                    }
                    displayCity();
                    console.log(fiveDayData);
                    //adding new html elements to html file from js
                    currentWeather.innerHTML = `<ul>
        <li class="title">${currentData.name} /<span> ${moment(
                        currentData.dt,
                        "X"
                    ).format(" MM/DD/YYYY")} </span></li>
        <li><img src ="http://openweathermap.org/img/wn/${currentData.weather[0].icon
                        }@2x.png" /></li>
        <li>Temp: ${currentData.main.temp}</li>
        <li>Wind: ${currentData.wind.speed}</li>
        <li>Humidity: ${currentData.main.humidity}</li>
    </ul>
        `;
                    var cards = "";
                    for (var i = 1; i < 6; i++) {
                        cards =
                            cards +
                            `<ul class="col-12 col-xl-2 day">
        <li>${moment(fiveDayData.daily[i].dt, "X").format(" MM/DD/YYYY")}</li>
        <li><img src ="http://openweathermap.org/img/wn/${fiveDayData.daily[i].weather[0].icon
                            }@2x.png" /></li>
        <li>Temp: ${fiveDayData.daily[i].temp.day}</li>
        <li>Wind: ${fiveDayData.daily[i].wind_speed}</li>
        <li>Humidity: ${fiveDayData.daily[i].humidity}</li>
    </ul>`;
                    }
                    fiveDayWeather.innerHTML = cards;
                });
        });
}
// shows previous searched city list under search
function displayCity() {
    if (localStorage.getItem("city")) {
        searchHistory = JSON.parse(localStorage.getItem("city"));
    }
    var cityList = "";
    for (var i = 0; i < searchHistory.length; i++) {
        cityList =
            cityList +
            `<button class="btn btn-secondary my-2" type="submit">${searchHistory[i]}</button>`;
    }
    searchedcities.innerHTML = cityList;
    var myDashTwo = document.querySelectorAll(".my-2");
    for (var i = 0; i < myDashTwo.length; i++) {
        myDashTwo[i].addEventListener("click", function () {
            weather(this.textContent);
        });
    }
}
displayCity();

searchForm.addEventListener("submit", home); 