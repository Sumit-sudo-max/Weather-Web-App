let currCity = "Delhi";
let units = 'metric';

const city = document.querySelector('.city-name');
const dateTime = document.querySelector('.weather-date-time');
const weatherForecast = document.querySelector('.weather-forecast');
const weatherTemperature = document.querySelector('.temperature');
const weatherIcons = document.querySelector('.weather-icons');
const weatherMinMax = document.querySelector('.weather-min-max');
const weatherRealFeel = document.querySelector('.weather-real-feel');
const humidity = document.querySelector('.weather-humidity');
const wind = document.querySelector('.weather-wind');
const pressure = document.querySelector('.weather-pressure');

document.querySelector('.search').addEventListener('submit', e => {
    const search = document.querySelector('.searching');
    e.preventDefault();
    currCity = search.value;
    getWeather();
    search.value = "";
});

document.querySelector(".weather_units_celsius").addEventListener('click', () => {
    if (units !== "metric") {
        units = "metric";
        getWeather();
    }
});

document.querySelector(".weather_units_farenheit").addEventListener('click', () => {
    if (units !== "imperial") {
        units = "imperial";
        getWeather();
    }
});

function convertTimeStamp(timestamp, timezone) {
    const convertTimezone = timezone / 3600;

    const date = new Date(timestamp * 1000);

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(date);

    return formattedDate;
}

function convertCountryCode(country) {
    let regionNames = new Intl.DisplayNames(["en"], {
        type: "region"
    });
    return regionNames.of(country);
}

function convertTimeStamp(timestamp, timezone) {
    const date = new Date(timestamp * 1000);

    const timezoneOffset = timezone / 60;

    const utcTime = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
    
    const adjustedDate = new Date(utcTime + timezoneOffset * 60 * 1000);

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short"
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(adjustedDate);

    return formattedDate;
}

function getWeather() {
    const API_KEY = 'cd2600feb1f00dbe4f06e7a8034f8fc9';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
            
            const localTime = convertTimeStamp(data.dt, data.timezone);
            dateTime.innerHTML = localTime;

            weatherForecast.innerHTML = `<p>${data.weather[0].main}</p>`;
            weatherTemperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
            weatherIcons.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
            weatherMinMax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`;
            weatherRealFeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
            humidity.innerHTML = `${data.main.humidity}%`;
            wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
            pressure.innerHTML = `${data.main.pressure} hPa`;

            updateBackground(data.weather[0].main);
        });
}

function updateBackground(weatherCondition) {
    const background = document.querySelector('.weather-background');
    const backgroundAnimations = {
        'Clear': 'sunny',
        'Clouds': 'cloudy',
        'Rain': 'rainy',
        'Drizzle': 'rainy',
        'Thunderstorm': 'thunderstorm',
        'Snow': 'snowy',
        'Mist': 'misty',
    };
    const animationClass = backgroundAnimations[weatherCondition] || '';
    background.className = 'weather-background';
    background.classList.add(`weather-${animationClass}`);
}

window.addEventListener('load', () => {
    getWeather();
});
