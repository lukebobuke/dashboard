weatherScript();
function weatherScript() {

    // DOM Elements
    const locationButton = document.getElementById("locationButton"); // Button to expand location input
    const addForm = document.getElementById("addForm"); // Form for entering a new city
    const addInput = document.getElementById("addInput"); // Input field for city name
    const addButton = document.getElementById("addButton"); // Button to submit city name
    const weatherButton = document.querySelectorAll(".weatherButton"); // Weather buttons for interaction
    const forecastDay = document.querySelectorAll(".forecastDay"); // Forecast day containers
    const cityDisplay = document.getElementById("cityDisplay"); // Display for the current city name
    const temp = document.querySelectorAll(".temp"); // Temperature elements
    const popContainer = document.querySelectorAll(".popContainer"); // Precipitation probability containers

    // Variables for weather data
    let dailySummary = []; // Summary of daily weather
    let responseForecast = ""; // Raw forecast response
    let dataForecast = ""; // Parsed forecast data
    let forecastArray = {}; // Object for hourly forecast data grouped by date
    let dataNow = []; // Current weather data

    // Default city and API key
    let city = "Chicago"; // Default city
    cityDisplay.innerText = city; // Display the default city
    const apiKey = "b310682931bcc24d7e4a32363c54e44d"; // OpenWeatherMap API key

    // Fetch weather data
    async function checkWeather() {
        const apiURLNow = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city}&appid=${apiKey}`; // Current weather API URL
        const apiURLForecast = `https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=${city}&appid=${apiKey}`; // 5-day forecast API URL
        
        // Fetch current weather
        const responseNow = await fetch(apiURLNow);
        if (!responseNow.ok) {
            console.log("Error fetching current weather data");
            cityDisplay.innerText = "City not found";
            return;
        }
        const dataNow = await responseNow.json();

        // Update current temperature and icon
        document.querySelector("#nowTemp").innerHTML = `${Math.round(dataNow.main.temp)}°`;
        displayIcons(dataNow.weather[0].icon, weatherNow);
        weatherNow.querySelector("i").classList.add("largeIcon");

        // Fetch 5-day forecast
        const responseForecast = await fetch(apiURLForecast);
        if (!responseForecast.ok) {
            console.log("Error fetching forecast data");
            cityDisplay.innerText = "City not found";
            return;
        }
        dataForecast = await responseForecast.json();
        console.log("Check weather function called for city:" + city);
        createSummary(); // Process and display forecast data
    }
    checkWeather();

    // Adjust UTC date and time to the city's timezone
    function adjustToCityTimezone(utcDate, timezoneOffset) {
        const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000); // Adjust by timezone offset in seconds
        // console.log("Adjusted date: " + localDate);
        return localDate;
    }

    // Process forecast data and create daily summaries
    function createSummary() {
        forecastArray = {}; // Change to an object to use dates as keys
        dailySummary = [];

        const timezoneOffset = dataForecast.city.timezone; // Get timezone offset from API response
        console.log("Timezone offset: " + timezoneOffset);

        // Group forecast data by date
        dataForecast.list.forEach(item => {
            const utcDate = new Date(item.dt_txt); // Parse UTC date and time
            const localDate = adjustToCityTimezone(utcDate, timezoneOffset); // Adjust to local timezone

            // Extract local date in YYYY-MM-DD format
            const date = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
            const time = `${String(localDate.getHours()).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}:${String(localDate.getSeconds()).padStart(2, '0')}`;

            let hourObject = { 
                time: time, 
                temperature: item.main.temp, 
                icon: item.weather[0].icon, 
                pop: item.pop * 100 // Precipitation probability
            };

            if (!forecastArray[date]) {
                forecastArray[date] = []; // Initialize an array for the date
            }
            forecastArray[date].push(hourObject); // Add the hourObject to the correct date
        });
        console.log(forecastArray);

        // Create daily summaries
        dailySummary = Object.keys(forecastArray).map(date => {
            let temps = [];
            let pops = [];
            forecastArray[date].forEach(item => {
                temps.push(item.temperature);
                pops.push(item.pop);
            });
            let dayHour = forecastArray[date].find(item => item.time === "12:00:00"); // Find midday data
            let dayIcon = dayHour ? dayHour.icon : undefined;
            return {
                date,
                highestTemp: Math.max(...temps),
                lowestTemp: Math.min(...temps),
                dayIcon,
                highestPop: Math.max(...pops)
            };
        });
        console.log(dailySummary);

        // Display daily summaries
        displayTemps(dailySummary, dayOne, 1);
        displayTemps(dailySummary, dayTwo, 2);
        displayTemps(dailySummary, dayThree, 3);
        displayTemps(dailySummary, dayFour, 4);
        displayIcons(dailySummary[1].dayIcon, dayOne);
        displayIcons(dailySummary[2].dayIcon, dayTwo);
        displayIcons(dailySummary[3].dayIcon, dayThree);
        displayIcons(dailySummary[4].dayIcon, dayFour);
        displayWeekDay(dailySummary[1].date, dayOne);
        displayWeekDay(dailySummary[2].date, dayTwo);
        displayWeekDay(dailySummary[3].date, dayThree);
        displayWeekDay(dailySummary[4].date, dayFour);
        displayPop(dailySummary[1].highestPop, dayOne);
        displayPop(dailySummary[2].highestPop, dayTwo);
        displayPop(dailySummary[3].highestPop, dayThree);
        displayPop(dailySummary[4].highestPop, dayFour);
    }

    // Event Listeners
    locationButton.addEventListener("click", (event) => {
        expandLocation(); // Expand location input form
    });
    addButton.addEventListener("click", (event) => {
        event.preventDefault();
        setLocation(); // Set new location
    });
    addInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            setLocation(); // Set new location on Enter key
        }
    });

    // Display weather icons
    function displayIcons(iconKey, id) {
        id.querySelector("i").className = ""; // Clear existing icon classes
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

    // Display temperature range
    function displayTemps(array, id, index) {
        id.querySelector(".temp").innerText = (Math.round(array[index].highestTemp) + "°/" + Math.round(array[index].lowestTemp) + "°");
    }

    // Display day of the week
    function displayWeekDay(date, id) {
        let offDate = new Date(date);
        let formattedDate = new Date(Date.UTC(offDate.getUTCFullYear(), offDate.getUTCMonth(),
        offDate.getUTCDate(), offDate.getUTCHours(),
        offDate.getUTCMinutes(), offDate.getUTCSeconds()));
        let dayNumber = formattedDate.getUTCDay(); // Get day of the week
        let dayString = "";
        switch(dayNumber) {
            case 0:
                dayString = "Sun";
                break;
            case 1:
                dayString = "Mon";
                break;
            case 2:
                dayString = "Tue";
                break;
            case 3:
                dayString = "Wed";
                break;
            case 4:
                dayString = "Thu";
                break;
            case 5:
                dayString = "Fri";
                break;
            case 6:
                dayString = "Sat";
                break;
        }
        id.querySelector(".dayName").innerText = dayString;
    }

    // Display precipitation probability
    function displayPop(pop, id) {
        id.querySelector(".pop").innerText = pop + "%";
    }

    // Expand location input form
    function expandLocation() {
        locationButton.style.display = "none";
        cityDisplay.style.display = "none";
        addForm.style.display = "flex";
        requestAnimationFrame(() => {
            addForm.style.width = "100%";
        });
        setTimeout(() => {
            addButton.style.display = "block";
        }, 750);
        addInput.focus();
    }

    // Set new location and fetch weather
    function setLocation() {
        city = addInput.value;
        cityDisplay.innerText = city;
        checkWeather();
        console.log(city);
        addForm.style.display = "none";
        addForm.style.width = 0;
        addButton.style.display = "none";
        locationButton.style.display = "block";
        cityDisplay.style.display = "block";
    }

    // Scale parent element for interaction
    function scaleParent(event) {
        event.target.focus();
        requestAnimationFrame(() => {
            event.target.parentElement.style.transform = "scale(1.5)";
            if (event.target.parentElement.querySelector(".temp")) {
                event.target.parentElement.querySelector(".temp").style.visibility = "visible";
            }
            if (event.target.parentElement.querySelector(".popContainer")) {
                event.target.parentElement.querySelector(".popContainer").style.visibility = "visible";
            }
        });
    }

    // Descale parent element after interaction
    function descaleParent(event) {
        requestAnimationFrame(() => {
            event.target.parentElement.style.transform = "scale(1)";
            if (event.target.parentElement.querySelector(".temp")) {
                event.target.parentElement.querySelector(".temp").style.visibility = "hidden";
            }
            if (event.target.parentElement.querySelector(".popContainer")) {
                event.target.parentElement.querySelector(".popContainer").style.visibility = "hidden";
            }
        });
    }
}