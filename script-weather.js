weatherScript();
function weatherScript() {



const locationButton = document.getElementById("locationButton")
const addForm = document.getElementById("addForm")
const addInput = document.getElementById("addInput")
const addButton = document.getElementById("addButton")
const weatherButton = document.querySelectorAll(".weatherButton")
const forecastDay = document.querySelectorAll(".forecastDay")
const cityDisplay = document.getElementById("cityDisplay")
const temp = document.querySelectorAll(".temp")
const popContainer = document.querySelectorAll(".popContainer")

let dailySummary = []
let responseForecast = ""
let dataForecast = ""
let forecastArray = []
let dataNow = []

// forecastDay.forEach(day => {
//     day.querySelector(".temp").style.visibility = "hidden"
//     day.querySelector(".popContainer").style.visibility = "hidden"
// })


let city = "Chicago"
cityDisplay.innerText = city
const apiKey = "b310682931bcc24d7e4a32363c54e44d"

async function checkWeather() {
    const apiURLNow = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city}&appid=${apiKey}`
    const apiURLForecast = `https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=${city}&appid=${apiKey}`
    
    const responseNow = await fetch(apiURLNow)
    if (!responseNow.ok) {
        console.log("Error fetching current weather data")
        cityDisplay.innerText = "City not found"
        return
    }
    const dataNow = await responseNow.json()

    document.querySelector("#nowTemp").innerHTML = `${Math.round(dataNow.main.temp)}°`
    displayIcons(dataNow.weather[0].icon, weatherNow)
    weatherNow.querySelector("i").classList.add("largeIcon")

    const responseForecast = await fetch(apiURLForecast)
    if (!responseForecast.ok) {
        console.log("Error fetching forecast data")
        cityDisplay.innerText = "City not found"
        return
    }
    dataForecast = await responseForecast.json()
    console.log("Check weather function called for city:" + city)
    createSummary()
}
checkWeather()
function createSummary(){
    forecastArray = []
    dailySummary = []
    dataForecast.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0]
        const time = item.dt_txt.split(" ")[1]
        let hourObject = {time: time, temperature: item.main.temp, icon: item.weather[0].icon, pop: item.pop * 100}
            if (!forecastArray[date]) {
            forecastArray[date] = []
        }
        forecastArray[date].push(hourObject)
    })
        let temps = []
        dailySummary = Object.keys(forecastArray).map(date => {
            let temps = []
            forecastArray[date].forEach(item => {
                temps.push(item.temperature)
            })
            let pops = []
            forecastArray[date].forEach(item => {
                pops.push(item.pop)
            })
            let dayHour = forecastArray[date].find(item => item.time === "12:00:00")
            dayHour ? dayIcon = dayHour.icon : dayIcon = undefined
            return {
                date,
                highestTemp: Math.max(...temps),
                lowestTemp: Math.min(...temps),
                dayIcon,
                highestPop: Math.max(...pops)
            }
        })
    
    // console.log(forecastArray)
    // console.log(dailySummary)
    displayTemps(dailySummary, dayOne, 1)
    displayTemps(dailySummary, dayTwo, 2)
    displayTemps(dailySummary, dayThree, 3)
    displayTemps(dailySummary, dayFour, 4)
    displayIcons(dailySummary[1].dayIcon, dayOne)
    displayIcons(dailySummary[2].dayIcon, dayTwo)
    displayIcons(dailySummary[3].dayIcon, dayThree)
    displayIcons(dailySummary[4].dayIcon, dayFour)
    displayWeekDay(dailySummary[1].date, dayOne)
    displayWeekDay(dailySummary[2].date, dayTwo)
    displayWeekDay(dailySummary[3].date, dayThree)
    displayWeekDay(dailySummary[4].date, dayFour)
    displayPop(dailySummary[1].highestPop, dayOne)
    displayPop(dailySummary[2].highestPop, dayTwo)
    displayPop(dailySummary[3].highestPop, dayThree)
    displayPop(dailySummary[4].highestPop, dayFour)
}

// EVENT LISTENERS

locationButton.addEventListener("click", (event) => {
    expandLocation()
})
// weatherButton.forEach(button => {
//     button.addEventListener("focus", function(event) {
//         scaleParent(event)
//     })
// })
// weatherButton.forEach(button => {
//     button.addEventListener("blur", function(event) {
//         descaleParent(event)
//     })
// })
addButton.addEventListener("click", (event) => {
    event.preventDefault()
    setLocation()
})
addInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault()
        setLocation()
    }
})

//FUNCTIONS
function displayIcons(iconKey, id) {
    id.querySelector("i").className = ""
    switch (iconKey) {
        case "01d": 
            id.querySelector("i").className = "weatherButton fa-solid fa-sun";
            break;
        case "02d": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud-sun";
            break;
        case "03d": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud";
            break;
        case "04d": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud";
            break;
        case "09d": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud-showers";
            break;
        case "10d": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud-showers-heavy";
            break;
        case "11d": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud-showers-heavy";
            break; 
        case "13d": 
            id.querySelector("i").className = "weatherButton fa-solid fa-snowflake";
            break;  
        case "50d": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud-showers";
            break;     
        case "01n": 
            id.querySelector("i").className = "weatherButton fa-solid fa-moon";
            break;
        case "02n": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud-moon";
            break;
        case "03n": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud";
            break;
        case "04n": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud";
            break;
        case "09n": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud-showers";
            break;
        case "10n": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud-showers-heavy";
            break;
        case "11n": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud-showers-heavy";
            break; 
        case "13n": 
            id.querySelector("i").className = "weatherButton fa-solid fa-snowflake";
            break;  
        case "50n": 
            id.querySelector("i").className = "weatherButton fa-solid fa-cloud-showers";
            break;  
        
    }
}
function displayTemps(array, id, index) {
    id.querySelector(".temp").innerText = (Math.round(array[index].highestTemp) + "°/" + Math.round(array[index].lowestTemp) + "°")
}
function displayWeekDay(date, id) {
    let offDate = new Date(date)
    let formattedDate = new Date(Date.UTC(offDate.getUTCFullYear(), offDate.getUTCMonth(),
    offDate.getUTCDate(), offDate.getUTCHours(),
    offDate.getUTCMinutes(), offDate.getUTCSeconds()))
    let dayNumber = formattedDate.getUTCDay()
    let dayString = ""
    switch(dayNumber) {
        case 0:
            dayString = "Sun"
            break
        case 1:
            dayString = "Mon"
            break
        case 2:
            dayString = "Tue"
            break
        case 3:
            dayString = "Wed"
            break
        case 4:
            dayString = "Thu"
            break
        case 5:
            dayString = "Fri"
            break
        case 6:
            dayString = "Sat"
            break
    }
    id.querySelector(".dayName").innerText = dayString

}
function displayPop(pop, id) {
    id.querySelector(".pop").innerText = pop + "%"
}
function expandLocation() {
    locationButton.style.display = "none"
    cityDisplay.style.display = "none"
    addForm.style.display = "flex"
    requestAnimationFrame(() => {
        addForm.style.width = "100%";
    });
    setTimeout(() => {
        addButton.style.display = "block";
    }, 750);
    addInput.focus()
}
function setLocation() {
    city = addInput.value
    cityDisplay.innerText = city
    checkWeather()
    console.log(city)
    addForm.style.display = "none"
    addForm.style.width = 0
    addButton.style.display = "none"
    locationButton.style.display = "block"
    cityDisplay.style.display = "block"
}
function scaleParent(event) {
    event.target.focus()
    // console.log("scale function called")
    requestAnimationFrame(() => {
        event.target.parentElement.style.transform = "scale(1.5)"
        if (event.target.parentElement.querySelector(".temp")) {
            event.target.parentElement.querySelector(".temp").style.visibility = "visible"
        }
        if (event.target.parentElement.querySelector(".popContainer")) {
            event.target.parentElement.querySelector(".popContainer").style.visibility = "visible"
        }
    })
}
function descaleParent(event) {
    // console.log("descale function called")
    requestAnimationFrame(() => {
        event.target.parentElement.style.transform = "scale(1)"
        if (event.target.parentElement.querySelector(".temp")) {
            event.target.parentElement.querySelector(".temp").style.visibility = "hidden"
        }
        if (event.target.parentElement.querySelector(".popContainer")) {
            event.target.parentElement.querySelector(".popContainer").style.visibility = "hidden"
        }
    })
}

}