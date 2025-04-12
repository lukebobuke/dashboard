document.addEventListener('DOMContentLoaded', () => {
// Initialize the page with the default content.
const root = document.documentElement
const body = document.querySelector("body")
const mainContent = document.getElementById("mainContent")
const weatherPageButton = document.getElementById('weatherPageButton')
const tasksPageButton = document.getElementById('tasksPageButton')
const calendarPageButton = document.getElementById('calendarPageButton')
const palletButton = document.getElementById("palletButton");
const colorButtonContainer = document.getElementById("colorButtonContainer");
const colorButtons = colorButtonContainer.querySelectorAll("button")

palletButton.addEventListener("click", (event) => {
    hideShow(event.target, colorButtonContainer)
})
colorButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        changeColorScheme(event)
        hideShow(event.target.parentElement, palletButton)
    })
})
function hideShow(...elements) {
    elements.forEach(element => {
        element.classList.toggle("hidden");
    });
}
function changeColorScheme(event) {
    console.log("change color scheme function called")
    console.log(event.target.id)
    switch(event.target.id) {
        case "daySchemeButton":
            root.style.setProperty("--mainColor", "rgb(255, 255, 255)")
            root.style.setProperty("--accentColor", "rgb(236, 172, 75)")
            root.style.setProperty("--textColor", "rgb(0, 0, 0)")
            console.log("changed to day colorScheme")
            break;
        case "nightSchemeButton":
            root.style.setProperty("--mainColor", "rgb(0, 0, 0)")
            root.style.setProperty("--accentColor", "rgb(198, 103, 88)")
            root.style.setProperty("--textColor", "rgb(255, 255, 255)")
            break;
        case "monetSchemeButton":
            root.style.setProperty("--mainColor", "rgb(189, 225, 226)")
            root.style.setProperty("--accentColor", "rgb(255, 255, 255)")
            root.style.setProperty("--textColor", "rgb(164, 116, 141)")
            break;
        case "vangoghSchemeButton":
            root.style.setProperty("--mainColor", "rgb(40, 40, 75)")
            root.style.setProperty("--accentColor", "rgb(240, 170, 100)")
            root.style.setProperty("--textColor", "rgb(240, 230, 200)")
            break;
    }
}

loadPage('index-calendar.html', "script-calendar.js", "calendarStyle", "calendarScript");
// loadPage('index-tasks.html', "script-tasks.js", "tasksStyle", "tasksScript");
// loadPage('index-weather.html', "script-weather.js", "weatherStyle", "weatherScript");



// const observer = new MutationObserver((mutationsList, observer) => {
//     mutationsList.forEach(mutation => {
//         if (mutation.type === 'childList') {
//             mutation.addedNodes.forEach(node => {
//                 if (node.nodeType === 1 && !(node.type === "text/javascript")) {
//                     node.classList.add('injectedNode');
//                     // console.log('A child node has been added:', node);
//                 }
//             })
//         }
//     })
// })
// observer.observe(document.body, {
//     childList: true,
//     subtree: true
// })
// Function to load a page (HTML, inline CSS, and associated script)
function loadPage(pageUrl, scriptURL, styleID, scriptClass) {
    // const injectedNodes = document.querySelectorAll(".injectedNode");
    // injectedNodes.forEach(node => {
    //     node.remove(); // Remove previously injected nodes.
    //     console.log('Removed injected node:', node);
    // });
    mainContent.innerHTML = ""; // Clear the main content before loading new page.
    
    

    // injectedNodes.remove();
    fetch(pageUrl)
        .then(response => response.text()) // Convert response to text.
        .then(html => {
            const parser = new DOMParser();
            const injectedDoc = parser.parseFromString(html, 'text/html');
            // --------------------------------------------------------------------
            // Inject the <main> content from the fetched page.
            // --------------------------------------------------------------------
            document.getElementById('mainContent').innerHTML = injectedDoc.querySelector('main').innerHTML;
            // --------------------------------------------------------------------
            // Inject the inline CSS from the fetched page's <head>.
            // --------------------------------------------------------------------
            const existingStyles = document.getElementsByClassName('injected-style');
            if (existingStyles.length > 0) {
                existingStyles[0].remove();
                console.log(`Removed existing style element with id: ${styleID}`);
            }
            const injectedStyle = injectedDoc.querySelector('style');
            const styleEl = document.createElement('style');
            styleEl.id = styleID;
            styleEl.classList.add('injected-style'); // Add a class for easier debugging
            styleEl.innerHTML = injectedStyle.innerHTML;
            document.head.appendChild(styleEl);
            
            
            // --------------------------------------------------------------------
            // Load the page-specific script dynamically.
            // --------------------------------------------------------------------
            const existingScript = document.getElementById(scriptClass);
            if (existingScript) {
                existingScript.remove();
            }
            const scriptEl = document.createElement('script');
            scriptEl.id = scriptClass;
            scriptEl.src = scriptURL;
            scriptEl.type = 'text/javascript';
            document.body.appendChild(scriptEl);
        })
        .catch(error => console.error('Error loading content:', error));
}

weatherPageButton.addEventListener('click', () => {
    loadPage('index-weather.html',"script-weather.js", "weatherStyle", "weatherScript");
    
    calendarPageButton.style.fontSize = "unset";
    tasksPageButton.style.fontSize = "unset";
    
    weatherPageButton.style.fontSize = "2rem";
    weatherPageButton.style.transition = "font-size 0.5s ease-in-out";
    
    calendarPageButton.style.order = "1";
    weatherPageButton.style.order = "2";
    tasksPageButton.style.order = "3";
});
tasksPageButton.addEventListener('click', () => {
    loadPage('index-tasks.html', "script-tasks.js", "tasksStyle", "tasksScript");
    weatherPageButton.style.fontSize = "unset";
    calendarPageButton.style.fontSize = "unset";
    
    tasksPageButton.style.fontSize = "2rem";
    tasksPageButton.style.transition = "font-size 0.5s ease-in-out";
    
    weatherPageButton.style.order = "1";
    tasksPageButton.style.order = "2";
    calendarPageButton.style.order = "3";
});
calendarPageButton.addEventListener('click', () => {
    loadPage('index-calendar.html', "script-calendar.js", "calendarStyle", "calendarScript");
    tasksPageButton.style.fontSize = "unset";
    weatherPageButton.style.fontSize = "unset";
    
    calendarPageButton.style.fontSize = "2rem";
    calendarPageButton.style.transition = "font-size 0.5s ease-in-out";
    
    tasksPageButton.style.order = "1";
    calendarPageButton.style.order = "2";
    weatherPageButton.style.order = "3";
});

});