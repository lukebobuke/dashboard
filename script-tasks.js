taskScript();
function taskScript() {

    // add to DOM and declare empty array of to-do items
    let plusButton = document.getElementById("plusButton")
    let addForm = document.getElementById("addForm")
    let addInput = document.getElementById("addInput")
    let addButton = document.getElementById("addButton")
    let mainList = document.getElementById("mainList")
    let todoArray = []

    // retrieve local storage of array of to-do items and display

    retrieveTodos()
    // console.log("stored array string = " + storedTodoArrayString)
    // console.log("todo array = " + todoArray)

    // add event listeners

    plusButton.addEventListener("click", (event) => {
            expandaddInput()
        })
    addButton.addEventListener("click", addTodo)
    
    // clearButton.addEventListener("click", clearTodos)

    addInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addTodo();
        }
    })
    mainList.addEventListener("click", (event) => {
        if (event.target.matches(".editButton")) {
            editTodo(event.target.dataset.todoIndex)
        }
        if (event.target.matches(".checkMark")) {
            checkTodo(event.target.dataset.todoIndex)
        }
        if (event.target.matches(".prioritizeButton")) {
            prioritizeTodo(event.target.dataset.todoIndex)
        }
        if (event.target.matches(".removeButton")) {
            removeTodo(event.target.dataset.todoIndex)
        }
    })
    function sortTodos() {
        todoArray.sort((a, b) => b.prioritized - a.prioritized)
        todoArray.sort((a, b) => a.checked - b.checked)
    }
    function storeTodos() {
        sortTodos()
        localStorage.setItem('todoArrayKey', JSON.stringify(todoArray))
    }
    function prioritizeTodo(prioritizedIndex) {
        if (todoArray[prioritizedIndex].prioritized == false && todoArray[prioritizedIndex].checked == false) {
            todoArray[prioritizedIndex].prioritized = true
        } else {
            todoArray[prioritizedIndex].prioritized = false
        }
        storeTodos()
        renderTodos()
        console.log("prioritize function called at index " + prioritizedIndex)
    }
    function retrieveTodos() {
        const storedTodoArrayString = localStorage.getItem('todoArrayKey');
        todoArray = JSON.parse(storedTodoArrayString) || []; // Ensure todoArray is an array
    }
    function checkTodo(checkedIndex) {
        if (todoArray[checkedIndex].checked == false){
                todoArray[checkedIndex].checked = true
                todoArray[checkedIndex].prioritized = false
            }
            else {
                todoArray[checkedIndex].checked = false
            }
        storeTodos()
        renderTodos()
        console.log("check function called at index " + checkedIndex)
    }
    function expandaddInput() {
        plusButton.style.display = "none"
        addForm.style.display = "flex"
        requestAnimationFrame(() => {
            addForm.style.width = "100%";
        });
        setTimeout(() => {
            addButton.style.display = "block";
        }, 750);
        addInput.focus()
    }
    function renderTodos() {
        // retrieve array of todo items from local storage
        retrieveTodos()

        function renderCheckmarks(i) {
            if (todoArray[i].checked == false) {
                return `<i data-todo-index=${i} class="fa-regular fa-circle checkMark"></i>`
            } else {
                return `<i data-todo-index=${i} class="fa-solid fa-circle-check checkMark"></i>`
            }
        }
        function renderitemText(i) {
            if (todoArray[i].checked == false) {
                return `<p data-todoindex = ${i} class="itemText">${todoArray[i].itemText}</p>`
            } else {
                return `<p data-todoindex = ${i} class="itemText strikethrough">${todoArray[i].itemText}</p>`
            }
        }
        function renderPriorityTag(i) {
            if (todoArray[i].prioritized == false) {
                return `<div class="priorityTag unprioritized"></div>`
            } else {
                return `<div class="priorityTag prioritized"></div>`
            }
        }
        // create HTML for array of to do items
        mainList.innerHTML = ""
        newHTML = ""
        todoArray.forEach((todo, i) => {
            let newHTML = (
                `<div class = listItemContainer>
                    ${renderCheckmarks(i)}
                    <div data-todo-index=${i} class="listItem border">
                        ${renderPriorityTag(i)}
                        ${renderitemText(i)}
                        <div class="actions">
                            <i class="editButton fa-solid fa-pen" data-todo-index=${i}></i>
                            <i class="fa-solid fa-circle-exclamation prioritizeButton" data-todo-index=${i}></i>
                            <i class="removeButton fa-solid fa-trash" data-todo-index=${i}></i>
                            </div>
                    </div>
                </div>`
            )
            mainList.innerHTML += newHTML
        });
    }
    function addTodo(e) {
        // stop page from re-loading when add button is pressed
        e.preventDefault()
        // add input value to array
        let todoObject = {itemText: addInput.value, checked: false, prioritized: false}
        todoArray.push(todoObject)
        // store modified array of to-do items in local storage
        storeTodos()
        //reset HTML and re-write it for the new array
        mainList.innerHtml = ""
        addInput.value = ""
        renderTodos()
        // confirm function called
        console.log("todo added at number " + todoArray.length + ": " + todoArray[(todoArray.length - 1)])
        console.log(todoArray)
        //switch display of plus button and todo form
        addForm.style.display = "none"
        addForm.style.width = 0
        addButton.style.display = "none"
        plusButton.style.display = "block"
    }
    function editTodo(editIndex) {
        const listItem = event.target.closest(".listItem")
        const editInput = document.createElement("input")
        editInput.classList.add("editInput", "accentBorder")
        editInput.type = "text"
        editInput.value = listItem.querySelector(".itemText").innerText
        listItem.replaceWith(editInput)
        editInput.focus()
        console.log("editTodo at" + " " + editIndex)
        function saveEdit() {
            todoArray[editIndex].itemText = editInput.value
            storeTodos()
            renderTodos()
            console.log("saved edits at index " + editIndex)
        }
        editInput.addEventListener("blur", saveEdit)
        editInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                saveEdit()
            }
        })
    }
    function removeTodo(removeIndex) {
        // keep items of array not at passed index
        todoArray = todoArray.filter((todo, i) => i != removeIndex)
        // store modified array of to-do items in local storage
        storeTodos()
        //reset HTML and re-write it for the new array
        mainList.innerHtml = ""
        renderTodos()
        // confirm function was called and index was passed
        console.log("removeTodo at" + " " + removeIndex)
    }
    renderTodos()

}