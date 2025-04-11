document.addEventListener('DOMContentLoaded', () => {
// Initialize the page with the default content.
const weatherPageButton = document.getElementById('weatherPageButton')
const tasksPageButton = document.getElementById('tasksPageButton')
const calendarPageButton = document.getElementById('calendarPageButton')
const weatherButtonContainer = document.getElementById('weatherButtonContainer')
const tasksButtonContainer = document.getElementById('tasksButtonContainer')
const calendarButtonContainer = document.getElementById('calendarButtonContainer')

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
    
    calendarButtonContainer.style.order = "1";
    weatherButtonContainer.style.order = "2";
    tasksButtonContainer.style.order = "3";
});
tasksPageButton.addEventListener('click', () => {
    loadPage('index-tasks.html', "script-tasks.js", "tasksStyle", "tasksScript");
    weatherPageButton.style.fontSize = "unset";
    calendarPageButton.style.fontSize = "unset";
    
    tasksPageButton.style.fontSize = "2rem";
    tasksPageButton.style.transition = "font-size 0.5s ease-in-out";
    
    weatherButtonContainer.style.order = "1";
    tasksButtonContainer.style.order = "2";
    calendarButtonContainer.style.order = "3";
});
calendarPageButton.addEventListener('click', () => {
    loadPage('index-calendar.html', "script-calendar.js", "calendarStyle", "calendarScript");
    tasksPageButton.style.fontSize = "unset";
    weatherPageButton.style.fontSize = "unset";
    
    calendarPageButton.style.fontSize = "2rem";
    calendarPageButton.style.transition = "font-size 0.5s ease-in-out";
    
    tasksButtonContainer.style.order = "1";
    calendarButtonContainer.style.order = "2";
    weatherButtonContainer.style.order = "3";
});

});