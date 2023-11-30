import { weatherTypes } from "./weatherTypeData.js";

document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("myAudio");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playhead = document.getElementById("playhead");
  const timeline = document.getElementById("timeline");

  playPauseBtn.onclick = function () {
    if (audio.paused) {
      audio.play();
      playPauseBtn.className = "pause";
    } else {
      audio.pause();
      playPauseBtn.className = "play";
    }
  };

  audio.addEventListener("timeupdate", function () {
    const playPercent = (timeline.offsetWidth - playhead.offsetWidth) / audio.duration;
    const move = audio.currentTime * playPercent;
    playhead.style.left = move + "px";
  });
});

const API_key = "ee6426d765574a768a1130626232610";

const CURRENT_WEATHER = async (city) => {
  const data = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${API_key}&q=${city}&aqi=no`
  );
  const json = await data.json();
  return json;
};

const searchInput = document.getElementById("input");
searchInput.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    searchWeather(e.target.value);
  }
});

const search = document.getElementById("search");
search.addEventListener("click", function () {
  searchWeather(searchInput.value);
});

function searchWeather(value) {
  if (value.length > 0) {
    CURRENT_WEATHER(value).then((data) => {
      displayData(data);
    });
    document.getElementById("input").value = "";
  }
}

const detailedInfoItems = Array.from(document.querySelectorAll(".weather-content li"));

const city = document.getElementById("city");
const temp = document.getElementById("temp");

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    CURRENT_WEATHER(`${position.coords.latitude + " " + position.coords.longitude}`).then((data) => {
      displayData(data);
    });
  });
} else {
  console.log("Geolocation is not supported in this browser.");
}

const displayData = (data) => {
  const current = data.current;
  console.log(data)
//   console.log(data.current.condition.icon.split("/").splice(3).join("/"));
//   const icon = document.getElementById("icon");
//   icon.src = "./assets/icons/"+data.current.condition.icon.split("/").splice(3).join("/");
  const weatherTypeKey = mapWeatherCodeToType(data.current.condition.code);
  const weatherTypeData = weatherTypes[weatherTypeKey];

  const audio = document.getElementById("myAudio");
  audio.src = `./assets/songs/${weatherTypeData.song}/1.mp3`;
  document.body.style.backgroundImage = `url(./assets/images/${weatherTypeData.image}/1.jpg)`;

  city.textContent = data.location.name;
  temp.innerHTML = `${current.temp_c}<span>°C</span>`;

//   data.current.icon 

  detailedInfoItems.forEach((item) => {
    const title = item.querySelector("strong");
    const value = item.querySelector("span");

    switch (title.textContent) {
      case "UV INDEX :":
        value.textContent = current.uv;
        break;
      case "HUMIDITY :":
        value.textContent = current.humidity + " %";
        break;
      case "WIND :":
        value.textContent = current.wind_kph + " km";
        break;
      case "FEELS LIKE :":
        value.textContent = current.feelslike_c + " °";
        break;
      case "VISIBILITY :":
        value.textContent = current.vis_km + " km";
        break;
      case "PRESSURE :":
        value.textContent = current.pressure_mb + " mbar";
        break;
      case "CHANCE OF RAIN :":
        value.textContent = current.precip_mm + " %";
        break;
      case "CLOUD :":
        value.textContent = current.cloud + " Lvl";
        break;
      default:
        break;
    }
  });
};

function mapWeatherCodeToType(code) {
    switch (code) {
      case 1000:
        return "clear";
      case 1003:
        return "partlyCloudy";
      case 1006:
        return "cloudy";
      case 1009:
        return "overcast";
      case 1030:
        return "mist";
      case 1063:
        return "patchyRainPossible";
      case 1066:
        return "patchySnowPossible";
      case 1069:
        return "patchySleetPossible";
      case 1072:
        return "patchyFreezingDrizzlePossible";
      case 1087:
        return "thunderyOutbreaksPossible";
      case 1114:
        return "blowingSnow";
      case 1117:
        return "blizzard";
      case 1135:
        return "fog";
      case 1147:
        return "freezingFog";
      case 1150:
        return "patchyLightDrizzle";
      case 1153:
        return "lightDrizzle";
      case 1168:
        return "freezingDrizzle";
      case 1171:
        return "heavyFreezingDrizzle";
      case 1180:
        return "patchyLightRain";
      case 1183:
        return "lightRain";
      case 1186:
        return "moderateRainAtTimes";
      case 1189:
        return "moderateRain";
      case 1192:
        return "heavyRainAtTimes";
      case 1195:
        return "heavyRain";
      case 1198:
        return "lightFreezingRain";
      case 1201:
        return "moderateOrHeavyFreezingRain";
      case 1204:
        return "lightSleet";
      case 1207:
        return "moderateOrHeavySleet";
      case 1210:
        return "patchyLightSnow";
      case 1213:
        return "lightSnow";
      case 1216:
        return "patchyModerateSnow";
      case 1219:
        return "moderateSnow";
      case 1222:
        return "patchyHeavySnow";
      case 1225:
        return "heavySnow";
      case 1237:
        return "icePellets";
      case 1240:
        return "lightRainShower";
      case 1243:
        return "moderateOrHeavyRainShower";
      case 1246:
        return "torrentialRainShower";
      case 1249:
        return "lightSleetShowers";
      case 1252:
        return "moderateOrHeavySleetShowers";
      case 1255:
        return "lightSnowShowers";
      case 1258:
        return "moderateOrHeavySnowShowers";
      case 1261:
        return "lightShowersOfIcePellets";
      case 1264:
        return "moderateOrHeavyShowersOfIcePellets";
      case 1273:
        return "patchyLightRainWithThunder";
      case 1276:
        return "moderateOrHeavyRainWithThunder";
      case 1279:
        return "patchyLightSnowWithThunder";
      case 1282:
        return "moderateOrHeavySnowWithThunder";
      default:
        return "unknown"; 
    }
  }
  
