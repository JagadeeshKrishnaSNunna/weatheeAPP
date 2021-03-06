
icons = {
    "sun": "<i class='sun icon'>",
    "cloud": '<i class="cloud icon">',
    "rain": '<i class="umbrella icon"></i>',
    "thunderstorm": '<i class="bolt icon"></i>',
    "snow": '<i class="snowflake icon"></i>',
    "none": '<i class="question circle outline icon"></i>'
}
info = {
    nodat: {
        "city": "City Not Found",
        "temp": "--°C",
        "wind": "--kmph",
        "humidity": "--%",
        "desc": "--"
    },
    card1: {
        "city": "",
        "temp": 0,
        "wind": "",
        "humidity": "",
        "desc": "",
        "unit": "°C"
    },
    card2: {
        "city": "",
        "temp": 0,
        "wind": "",
        "humidity": "",
        "desc": "",
        "unit": "°C"
    },
}
var flag = 0;
hourly = [];
daily = []
description = []
weather = []
node = {
}

function getLocation() {
    if(sessionStorage.getItem('lat')==null){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            document.getElementById("notification").style.visibility = "visible";
            document.getElementById("notification").innerHTML = "Geolocation is not supported by this browser.";
        }
    }else{
        c={
            'coords':{}
        }
        c.coords.latitude=sessionStorage.getItem('lat');
            c.coords.longitude=sessionStorage.getItem('long');
            console.log(c);
        showPosition(c)
    }

}

async function showPosition(position) {
    await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=3a2d73ed6c4e63f1257484523c540b43`)
        .then(async (response) => await response.json())
        .then(data => {
            render(Math.floor(data.main.temp - 273.15), '°C', data.wind.speed + " kmph", data.main.humidity + " %", data.weather[0].main, data.name);
            info.card1.city = data.name;
            info.card1.temp = Math.floor(data.main.temp - 273.15);
            info.card1.humidity = data.main.humidity + " %";
            info.card1.wind = data.wind.speed + " kmph";
            info.card1.desc = data.weather[0].main;
            info.card2.city = data.name;
            info.card2.temp = Math.floor(data.main.temp - 273.15);
            info.card2.humidity = data.main.humidity + " %";
            info.card2.wind = data.wind.speed + " kmph";
            info.card2.desc = data.weather[0].main;
            updatteArray(position.coords.latitude, position.coords.longitude);
        })
        
            sessionStorage.setItem('lat',position.coords.latitude);
            sessionStorage.setItem('long',position.coords.longitude);
}

function updatteArray(lat, long) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=current,minutely,alerts,&appid=3a2d73ed6c4e63f1257484523c540b43")
        .then(response => response.json())
        .then(data => {
            hourly = [];
            daily = []
            description = []
            weather = []
            for (var i = 0; i < 24; i++) {
                s = data.hourly[i].wind_speed + "kmph" + ';' + data.hourly[i].weather[0].main + ';' + i;
                if (i < 12) { s += " AM" } else { s += 'PM' }
                hourly.push(Math.floor(data.hourly[i].temp - 273));
                description.push(s)
            }
            for (var i = 0; i < 4; i++) {
                daily.push(data.daily[i].temp);
                s = data.daily[i].humidity + ";" + data.daily[i].wind_speed + ";" + data.daily[i].weather[0].main + ";" + data.daily[i].pressure;
                weather.push(s);

            }
            sessionStorage.setItem('hrs', JSON.stringify(hourly));
            sessionStorage.setItem('daily', JSON.stringify(daily));
            sessionStorage.setItem('weather', JSON.stringify(weather));
            sessionStorage.setItem('desc', JSON.stringify(description));
            sessionStorage.setItem('icon', JSON.stringify(icons));
        })
}

function showError(error) {
    document.getElementById("notification1").style.visibility = "visible";
    document.getElementById("notification1").innerHTML = error.message;
}




async function getData(city, cn) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=3a2d73ed6c4e63f1257484523c540b43")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (cn == 0) {
                info.card1.city = data.name;
                info.card1.temp = Math.floor(data.main.temp - 273.15);
                info.card1.humidity = data.main.humidity + " %";
                info.card1.wind = data.wind.speed + " kmph";
                info.card1.desc = data.weather[0].main;
                renderCard1(info.card1, 0);
                updatteArray(data.coord.lat, data.coord.lon);
            }
            else {
                info.card2.city = data.name;
                info.card2.temp = Math.floor(data.main.temp - 273.15);
                info.card2.humidity = data.main.humidity + " %";
                info.card2.wind = data.wind.speed + " kmph";
                info.card2.desc = data.weather[0].main;
                renderCard1(info.card2, 1);
            }
            sessionStorage.setItem('lat',data.coord.lat);
            sessionStorage.setItem('long',data.coord.lon);
        })
        .catch(err => renderCard1(info.nodat, cn))
    document.getElementById('C1city').value = '';
    document.getElementById('C2city').value = '';
    document.getElementById('city').value = '';
}

function render(t, u, w, h, d, c) {
    var s = "<table>"
    s = s + "<tr><td>Temperature : </td><td class='cursur' onclick=\"changeunit()\">" + t + " " + u + "</td></tr>";
    s += "<tr><td>Wind : </td><td>" + w + "</td></tr>";
    s += "<tr><td>Humiduty : </td><td>" + h + "</td></tr>";
    s += "<tr><td>Description : </td><td>" + d + "</td></tr></table>"
    document.getElementById('cityName1').innerHTML = c;
    if (d == "clear sky" || d == "Clear") {
        document.getElementById("icon1").innerHTML = icons.sun;
    } else if (d == "few clouds" || d == "Clouds" || d == "scattered clouds") {
        document.getElementById("icon1").innerHTML = icons.cloud;
    }
    else if (d == "Rain") { document.getElementById("icon1").innerHTML = icons.rain; }
    else if (d == "--") { document.getElementById("icon1").innerHTML = icons.none; }
    else if (d == "Thunderstorm") { document.getElementById("icon1").innerHTML = icons.thunderstorm; }
    else { document.getElementById("icon1").innerHTML = icons.snow; }
    document.getElementById("results1").innerHTML = s;

}

function renderCard1(card1, cn) {
    var s = "<table>"
    s = s + "<tr><td>Temperature : </td><td class='cursur' onclick=\"changeunit()\">" + card1.temp + " " + card1.unit + "</td></tr>";
    s += "<tr><td>Wind : </td><td>" + card1.wind + "</td></tr>";
    s += "<tr><td>Humiduty : </td><td>" + card1.humidity + "</td></tr>";
    s += "<tr><td>Description : </td><td>" + card1.desc + "</td></tr></table>"
    if (cn == 0) {

        document.getElementById('cityName1').innerHTML = card1.city;
        if (card1.desc == "clear sky" || card1.desc == "Clear") {
            document.getElementById("icon1").innerHTML = icons.sun;
        } else if (card1.desc == "few clouds" || card1.desc == "Clouds" || card1.desc == "scattered clouds") {
            document.getElementById("icon1").innerHTML = icons.cloud;
        }
        else if (card1.desc == "Rain") { document.getElementById("icon1").innerHTML = icons.rain; }
        else if (card1.desc == "--") { document.getElementById("icon1").innerHTML = icons.none; }
        else if (card1.desc == "Thunderstorm") { document.getElementById("icon1").innerHTML = icons.thunderstorm; }
        else { document.getElementById("icon1").innerHTML = icons.snow; }
        document.getElementById("results1").innerHTML = s;
    } else {

        document.getElementById('cityName2').innerHTML = card1.city;
        if (card1.desc == "clear sky" || card1.desc == "Clear") {
            document.getElementById("icon2").innerHTML = icons.sun;
        } else if (card1.desc == "few clouds" || card1.desc == "Clouds" || card1.desc == "scattered clouds") {
            document.getElementById("icon2").innerHTML = icons.cloud;
        }
        else if (card1.desc == "Rain") { document.getElementById("icon2").innerHTML = icons.rain; }
        else if (card1.desc == "--") { document.getElementById("icon2").innerHTML = icons.none; }
        else if (card1.desc == "Thunderstorm") { document.getElementById("icon2").innerHTML = icons.thunderstorm; }
        else { document.getElementById("icon2").innerHTML = icons.snow; }
        document.getElementById("results2").innerHTML = s;
    }
}






function Compare() {
    document.getElementById('compBut').style.display = "none";
    document.getElementById('C1Search').style.display = "";
    document.getElementById('mainSearch').style.display = "none";
    document.getElementById('c2').style.display = "";
    document.getElementById('CloseBut').style.display = "";
    document.getElementById('forecast').style.display = "none"
    renderCard1(info.card2, 1);
}
function closeBTN() {
    document.getElementById('compBut').style.display = "";
    document.getElementById('C1Search').style.display = "none";
    document.getElementById('mainSearch').style.display = "";
    document.getElementById('c2').style.display = "none";
    document.getElementById('CloseBut').style.display = "none";
    document.getElementById('forecast').style.display = ""
}

function changeunit() {
    if (flag == 0) {
        info.card1.temp = Math.floor((info.card1.temp * 9 / 5) + 32);
        info.card2.temp = Math.floor((info.card2.temp * 9 / 5) + 32);
        flag = 1;
        info.card1.unit = "°F";
        info.card2.unit = "°F";
        renderCard1(info.card1, 0)
        renderCard1(info.card2, 1)
    } else {
        flag = 0;
        info.card1.temp = Math.floor((info.card1.temp - 32) * 5 / 9);
        info.card2.temp = Math.floor((info.card2.temp - 32) * 5 / 9);
        info.card1.unit = "°C";
        info.card2.unit = "°C";
        renderCard1(info.card1, 0)
        renderCard1(info.card2, 1)
    }
}



