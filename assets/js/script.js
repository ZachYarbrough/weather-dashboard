var cityContainer = document.querySelector('.cities');
var submit = document.querySelector('.submit-city');
var cityNames = [];


var cityButtons = JSON.parse(localStorage.getItem('cities'));
if(!cityButtons) {
    cityButtons = [];
}

for(var i = 0; i < cityButtons.length; i++) {
    var cityButton = document.createElement('button');
    cityButton.classList = 'col-12 mt-3 cityBtn';
    cityButton.textContent = cityButtons[i];
    cityContainer.append(cityButton);
    cityButton.addEventListener('click', function() {
        fetchAPI(this.textContent);
    })
}

var fetchAPI = function(cityName) {
    var currCity = document.querySelector('.city');
    var date = document.querySelectorAll('.date');
    var icon = document.querySelectorAll('.icon');
    var temp = document.querySelectorAll('.temp');
    var wind = document.querySelectorAll('.wind');
    var hum = document.querySelectorAll('.hum');
    var uvi = document.querySelector('.uv');

    return fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=2b549fc3c2fff6bcd358befc6405596d').then(function(response) {
        if(response.ok){
            var newCityName = true;
            for(var i = 0; i < cityButtons.length; i++) {
                if(cityButtons[i] === cityName) {
                    newCityName = false;
                }
            }

            if(newCityName) {
                var newCity = document.createElement('button');
                newCity.classList = 'col-12 mt-3 cityBtn';
                newCity.textContent = cityName;
                cityContainer.append(newCity);
                newCity.addEventListener('click', function() {
                        fetchAPI(newCity.textContent);
                })
                cityButtons.push(cityName);
                localStorage.setItem('cities', JSON.stringify(cityButtons));
            }
            return response.json();
        }
    })
    .then(function(data) {
        currCity.textContent = data.name;
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        fetch('https://api.openweathermap.org/data/3.0/onecall?lat='+ lat + '&lon=' + lon + '&units=imperial&appid=2b549fc3c2fff6bcd358befc6405596d').then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data)
            var currDate = new Date(data.current.dt * 1000);
            var currDayOfMonth = currDate.getDate();
            var currMonth = currDate.getMonth();
            var currYear = currDate.getFullYear();
            date[0].textContent = '(' + (currMonth + 1) + '/' + currDayOfMonth + '/' + currYear + ')';
            currCity.innerHTML += ' ' + `<span class="date"> ${date[0].textContent} </span>` + ` <img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png"/>`;
            temp[0].textContent = data.current.temp + ' °F';
            wind[0].textContent = data.current.wind_speed + ' MPH';
            hum[0].textContent = data.current.humidity + '%';
            uvi.textContent = data.current.uvi;

            if(data.current.uvi < 2) {
                uvi.classList.remove('high');
                uvi.classList.remove('moderate');
                uvi.classList.add('low');
            } else if(data.current.uvi > 2 && data.current.uvi < 5) {
                uvi.classList.remove('low');
                uvi.classList.remove('high');
                uvi.classList.add('moderate');
            } else {
                uvi.classList.remove('low');
                uvi.classList.remove('moderate');
                uvi.classList.add('high');
            }

            for(var i = 0; i < (date.length - 1); i++) {
                var newDate = new Date(data.daily[i].dt * 1000);
                var dayOfMonth = newDate.getDate();
                var month = newDate.getMonth();
                var year = newDate.getFullYear();
                date[i + 1].textContent = (month + 1) + "-" + (dayOfMonth + 1) + "-" + year;;
                icon[i].setAttribute('src', `https://openweathermap.org/img/wn/${data.daily[i + 1].weather[0].icon}.png`);
                temp[i + 1].textContent = data.daily[i + 1].temp.day + ' °F';
                wind[i + 1].textContent = data.daily[i + 1].wind_speed + ' MPH';
                hum[i + 1].textContent = data.daily[i + 1].humidity + '%';
            }
        })
    });
}

submit.addEventListener('click', function() {
    var city = document.querySelector('.input-city').value;
    fetchAPI(city);
});