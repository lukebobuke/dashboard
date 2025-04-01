document.getElementById('weatherPageButton').addEventListener('click', () => {
    fetch('index-weather.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            // Extract and inject the <main> content from index-weather.html
            const newMain = doc.querySelector('main').innerHTML;
            document.getElementById('mainContent').innerHTML = newMain;
            // Extract the <style> tag from the fetched document's head
            const weatherStyle = doc.querySelector('head style');
            if (weatherStyle && !document.getElementById('weatherStyles')) {
                const styleEl = document.createElement('style');
                styleEl.id = 'weatherStyles';
                styleEl.innerHTML = weatherStyle.innerHTML;
                document.head.appendChild(styleEl);
            }
            // Remove any existing weather script and append a fresh one with cache busting
            const existingScript = document.getElementById('weatherScript');
            if (existingScript) {
                existingScript.remove();
            }
            const scriptEl = document.createElement('script');
            scriptEl.id = 'weatherScript';
            scriptEl.src = 'script-weather.js?cb=' + new Date().getTime();
            scriptEl.onload = () => {
                console.log("script-weather.js loaded");
                if (typeof checkWeather === 'function') {
                    checkWeather();
                } else {
                    console.warn("checkWeather function is not defined");
                }
            };
            document.body.appendChild(scriptEl);
            history.pushState(null, '', 'index-weather.html');
        })
        .catch(error => console.error('Error loading weather content:', error));
});
