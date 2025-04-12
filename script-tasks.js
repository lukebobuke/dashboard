taskScript();
function taskScript() {

    
    
    // add to DOM and declare empty array of to-do items
    let taskPlusButton = document.getElementById("taskPlusButton")
    let todoForm = document.getElementById("todoForm")
    let todoInput = document.getElementById("todoInput")
    let addButton = document.getElementById("addButton")
    let todoList = document.getElementById("todoList")
    let todoArray = []

    // retrieve local storage of array of to-do items and display

    retrieveTodos()
    // console.log("stored array string = " + storedTodoArrayString)
    // console.log("todo array = " + todoArray)

    // add event listeners

    taskPlusButton.addEventListener("click", (event) => {
            expandTodoInput()
        })
    addButton.addEventListener("click", addTodo)
    
    // clearButton.addEventListener("click", clearTodos)

    todoInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addTodo();
        }
    })
    todoList.addEventListener("click", (event) => {
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
        storedTodoArrayString = localStorage.getItem('todoArrayKey')
        todoArray = JSON.parse(storedTodoArrayString)
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
    function expandTodoInput() {
        taskPlusButton.style.display = "none"
        todoForm.style.display = "flex"
        requestAnimationFrame(() => {
            todoForm.style.width = "100%";
        });
        setTimeout(() => {
            addButton.style.display = "block";
        }, 750);
        todoInput.focus()
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
        function renderTodoText(i) {
            if (todoArray[i].checked == false) {
                return `<p data-todoindex = ${i} class="todoText">${todoArray[i].todoText}</p>`
            } else {
                return `<p data-todoindex = ${i} class="todoText strikethrough">${todoArray[i].todoText}</p>`
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
        todoList.innerHTML = ""
        newHTML = ""
        todoArray.forEach((todo, i) => {
            let newHTML = (
                `<div class = todoItemContainer>
                    ${renderCheckmarks(i)}
                    <div data-todo-index=${i} class="todoItem">
                        ${renderPriorityTag(i)}
                        ${renderTodoText(i)}
                        <div class="actions">
                            <i class="editButton fa-solid fa-pen" data-todo-index=${i}></i>
                            <i class="fa-solid fa-circle-exclamation prioritizeButton" data-todo-index=${i}></i>
                            <i class="removeButton fa-solid fa-trash" data-todo-index=${i}></i>
                            </div>
                    </div>
                </div>`
            )
            todoList.innerHTML += newHTML
        });
    }
    function addTodo(e) {
        // stop page from re-loading when add button is pressed
        e.preventDefault()
        // add input value to array
        let todoObject = {todoText: todoInput.value, checked: false, prioritized: false}
        todoArray.push(todoObject)
        // store modified array of to-do items in local storage
        storeTodos()
        //reset HTML and re-write it for the new array
        todoList.innerHtml = ""
        todoInput.value = ""
        renderTodos()
        // confirm function called
        console.log("todo added at number " + todoArray.length + ": " + todoArray[(todoArray.length - 1)])
        console.log(todoArray)
        //switch display of plus button and todo form
        todoForm.style.display = "none"
        todoForm.style.width = 0
        addButton.style.display = "none"
        taskPlusButton.style.display = "block"
    }
    function editTodo(editIndex) {
        const todoItem = event.target.closest(".todoItem")
        const editInput = document.createElement("input")
        editInput.classList.add("editInput")
        editInput.type = "text"
        editInput.value = todoItem.querySelector(".todoText").innerText
        todoItem.replaceWith(editInput)
        editInput.focus()
        console.log("editTodo at" + " " + editIndex)
        function saveEdit() {
            todoArray[editIndex].todoText = editInput.value
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
        todoList.innerHtml = ""
        renderTodos()
        // confirm function was called and index was passed
        console.log("removeTodo at" + " " + removeIndex)
    }
    renderTodos()

}