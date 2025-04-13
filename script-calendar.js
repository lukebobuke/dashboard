if (document.readyState !== "loading") {
    calendarScript();
} else {
    document.addEventListener("DOMContentLoaded", calendarScript);
}

function calendarScript(){

//////////////////////////////////////// VARIABLES ////////////////////////////////////////
const eventPopup = document.getElementById("eventPopup");
const eventDate = document.getElementById("eventDate");
const mainList = document.getElementById("mainList");
const closePopupButton = document.getElementById("closePopupButton");
const plusButton = document.getElementById("plusButton");
// const main = document.querySelector("main");
const mainContainer = document.querySelector("#mainContainer");
const addForm = document.querySelector("#addForm");
const gridContainer = document.getElementById("calendar-grid");
const currentMonthElement = document.getElementById("current-month");
let events = retrieveEvents(); // Retrieve events from local storage
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentMonthIndex = new Date().getMonth();


/////////////////////////////////////// EVENT LISTENERS ///////////////////////////////////////

gridContainer.addEventListener("click", (event) => {
    const cell = event.target.closest(".grid-cell");
    if (!cell) return;
    
    const cellDate = cell.querySelector('span')?.textContent?.trim(); // Use span for date number
    if (!cellDate) return;
    
    const dateObj = new Date(new Date().getFullYear(), currentMonthIndex, cellDate);
    if (dateObj.getMonth() === currentMonthIndex) {
        const dayOfWeek = dateObj.toLocaleString('default', { weekday: 'short' });
        const monthName = dateObj.toLocaleString('default', { month: 'short' });
        const formattedDate = `${dayOfWeek}, ${monthName} ${cellDate}`;
        eventDate.textContent = formattedDate;
        eventDate.dataset.date = dateObj.toISOString().split('T')[0];
        // Ensure popup is shown
        hideShow(mainContainer, eventPopup);
        // Call displayEvents for the selected date
        displayEvents(eventDate.dataset.date);
    }
});


closePopupButton.addEventListener("click", () => {
    hideShow(eventPopup, mainContainer);
});

plusButton.addEventListener("click", () => {
    expandInput(plusButton, addForm);
});

addButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission
    createEvent();
});

mainList.addEventListener("click", (event) => {
    if (event.target.classList.contains("fa-trash")) {
        deleteEvent(event);
    } else if (event.target.classList.contains("fa-pencil-alt")) {
        editEvent(event);
    }
});

document.getElementById("prev-month").addEventListener("click", () => {
    currentMonthIndex = (currentMonthIndex - 1 + 12) % 12;
    updateMonth();
});

document.getElementById("next-month").addEventListener("click", () => {
    currentMonthIndex = (currentMonthIndex + 1) % 12;
    updateMonth();
});

////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////

// LOCAL STORAGE FUNCTIONS

function storeEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

function retrieveEvents() {
    return JSON.parse(localStorage.getItem('events')) || {};
}

// CALENDAR NAVIGATION FUNCTIONS

function updateMonth() {
    currentMonthElement.textContent = monthNames[currentMonthIndex];
    populateDays();
}

function populateDays() {
    createGrid(); // Ensure the grid is created with eventDotsContainer in each cell
    const daysInMonth = new Date(new Date().getFullYear(), currentMonthIndex + 1, 0).getDate();
    const firstDayIndex = new Date(new Date().getFullYear(), currentMonthIndex, 1).getDay();
    const today = new Date().getDate();
    const thisMonth = new Date().getMonth();
    const cells = gridContainer.querySelectorAll('.grid-cell');

    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const cellDate = new Date(new Date().getFullYear(), currentMonthIndex, i - firstDayIndex + 1);
        const dotContainer = cell.querySelector('.event-dot-container');
        const dateNumber = i - firstDayIndex + 1;

        if (i < firstDayIndex || i >= firstDayIndex + daysInMonth) {
            // Outside current month
            cell.classList.add('outside-month');
        } else {
            // Inside current month
            const dateSpan = document.createElement('span'); // Create a span for the date number
            dateSpan.textContent = dateNumber; // Set the text content to the date number
            cell.insertBefore(dateSpan, dotContainer); // Insert the date number before the dot container

            if (dateNumber === today && currentMonthIndex === thisMonth) {
                cell.classList.add("today", "accentBorder"); // Highlight today's date
            }
        }
    }
    updateEventDots(); // Update event dots after populating days
}

function createGrid() {
    gridContainer.innerHTML = "";
    const rows = 6;
    const columns = 7;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('div');
            cell.classList.add("grid-cell", "border");
            gridContainer.appendChild(cell);
            const eventDotsContainer = document.createElement("div");
            eventDotsContainer.classList.add("event-dot-container");
            eventDotsContainer.innerHTML = ""
            cell.appendChild(eventDotsContainer); // Add event dots container to each cell

        }
    }
}

// EVENT MANAGEMENT FUNCTIONS

function displayEvents(date) {
    console.log("Displaying events for date:", date);
    console.log("Events object:", events);
    mainList.innerHTML = ''; // Clear previous events
    if (events[date]) {
        events[date].forEach((evt) => {
            const listItemContainer = `
                <div class="listItemContainer">   
                    <div class="listItem border">
                        <p class="itemText">${evt}</p>
                        <div class="actions">
                            <i class="fas fa-trash"></i>
                            <i class="fas fa-pencil-alt"></i>
                        </div>
                    </div>
                </div>
            `;
            mainList.insertAdjacentHTML('beforeend', listItemContainer);
        });
    } else {
        const noitemText = `
            <p class="itemText">No events</p>
        `;
        mainList.insertAdjacentHTML('beforeend', noitemText);
        mainList.style.alignItems = "center";
    }
}
function createEvent() {
    const addInput = addForm.querySelector("input");
    const date = eventDate.dataset.date;
    const eventName = addInput.value.trim();
    
    if (eventName) {
        if (!events[date]) {
            events[date] = [];
        }
        events[date].push(eventName);
        storeEvents(); // Store updated events in local storage
        displayEvents(date);
        updateEventDots();
    }
    addInput.value = ""; // Clear the input field after adding the event
    plusButton.style.display = "block";
    addForm.style.display = "none";
}
function deleteEvent(event) {
    const trashIcon = event.target;
    const listItemContainer = trashIcon.closest(".listItemContainer");
    const date = eventDate.dataset.date;
    const index = Array.from(mainList.children).indexOf(listItemContainer);
    events[date].splice(index, 1);
    if (events[date].length === 0) {
        delete events[date];
    }
    storeEvents(); // Store updated events in local storage
    displayEvents(date);
    updateEventDots();
}
function editEvent(event) {
    const listItemContainer = event.target.closest(".listItemContainer");
    const editIndex = Array.from(mainList.children).indexOf(listItemContainer);
    const listItem = listItemContainer.querySelector(".listItem");
    const editInput = document.createElement("input")
    editInput.classList.add("editInput", "accentBorder")
    editInput.type = "text"
    editInput.value = listItem.querySelector(".itemText").innerText
    listItem.replaceWith(editInput)
    editInput.focus()
    console.log("editEvent at" + " " + editIndex)
    const date = eventDate.dataset.date;
    function saveEdit() {
        events[date][editIndex] = editInput.value
        storeEvents()
        displayEvents(date)
        console.log("saved edits at index " + editIndex)
    }
    editInput.addEventListener("blur", saveEdit)
    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            saveEdit()
        }
    })
}

// UI UPDATE FUNCTIONS

function expandInput(expandButton, form) {
    console.log("expandInput called");
    expandButton.style.display = "none";
    form.style.display = "flex";
    console.log(expandButton.style.display);
    console.log(form.style.display);
    requestAnimationFrame(() => {
        form.style.width = "100%";
    });
    setTimeout(() => {
        form.querySelector("button").style.display = "block";
        console.log(form.querySelector("button").style.display);
    }, 750);
    form.querySelector("input").focus();
}
function updateEventDots() {
    const cells = gridContainer.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        const cellDate = cell.textContent.trim();
        if (!cellDate) return; // Skip empty cells

        const date = new Date(new Date().getFullYear(), currentMonthIndex, cellDate);

        // Ensure the cell belongs to the current month
        if (date.getMonth() !== currentMonthIndex) return;

        const eventDotsContainer = cell.querySelector('.event-dot-container');
        eventDotsContainer.innerHTML = ''; // Clear existing dots

        if (events[date.toISOString().split('T')[0]]) {
            const maxDots = 3; // Maximum number of dots to display
            const eventsToShow = events[date.toISOString().split('T')[0]].slice(0, maxDots); // Limit to 3 events
            eventsToShow.forEach(() => {
                const dot = document.createElement('div');
                dot.classList.add('event-dot');
                eventDotsContainer.appendChild(dot);
            });
        }
    });
}
function hideShow(...elements) {
    elements.forEach(element => {
        element.classList.toggle("hidden");
        console.log(element, element.classList);
    });
}

updateMonth();

}