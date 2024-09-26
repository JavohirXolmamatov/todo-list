const formCreate = document.getElementById('form-create');
const formEdit = document.getElementById('form-edit');
const listGroupTodo = document.getElementById('list-group-todo');
const time = document.getElementById('time');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');
const fullDay = document.getElementById('full-day');
const hourEl = document.getElementById('hour');
const minuteEl = document.getElementById('minute');
const secondEl = document.getElementById('second');
const closeEl = document.getElementById('close');

function mainDate() {
    const now = new Date();
    let day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    let month = now.getMonth() < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1);
    let year = now.getFullYear();

    fullDay.textContent = `${day} ${month}, ${year}`;

    let hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    let minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    let second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();

    hourEl.textContent = hour;
    minuteEl.textContent = minute;
    secondEl.textContent = second;

    return `${hour}:${minute}, ${day}/${month}/${year}`;
}
setInterval(mainDate);

// check LocalStorage
let todos = JSON.parse(localStorage.getItem('list')) || [];

if (todos.length) {
    showTodos();
}

// set todos to localStorage
function setTodos() {
    localStorage.setItem('list', JSON.stringify(todos));
    showTodos();
}

// show localStorage
function showTodos() {
    listGroupTodo.innerHTML = '';
    todos.forEach((item, i) => {
        listGroupTodo.innerHTML += `
            <li ondblclick="setCompleted(${i})" class="list-group-item d-flex justify-content-between ${item.completed ? 'completed' : ''}">
                ${item.text}
                <div class="todo-icons">
                    <span class="opacity-50 me-2">${item.time}</span>
                    <img onclick="editTodos(${i})" src="./img/edit.svg" alt="edit icon" style="width: 24px; height: 24px;">
                    <img onclick="removeTodos(${i})" src="./img/delete.svg" alt="delete icon" style="width: 24px; height: 24px;">
                </div>
            </li>
        `;
    });
}


// danger text 
function dangerText(where, message) {
    document.getElementById(`${where}`).textContent = message;
    setTimeout(() => {
        document.getElementById(`${where}`).textContent = '';
    }, 2500);
}

// get todos
formCreate.addEventListener('submit', (e) => {
    e.preventDefault();
    let todoText = formCreate['input-create'].value.trim();
    formCreate.reset();
    if (todoText.length) {
        todos.push({ text: todoText, time: mainDate(), completed: false });
        setTodos();
    } else {
        dangerText('message-create', 'Please, Enter some todo...');
    }
});

// deleted todo
function removeTodos(id) {
    todos.splice(id, 1);
    setTodos();
}

// edit todo
let editId;

function editTodos(id) {
    modal.style.display = 'block';
    overlay.style.display = 'block';

    formEdit['input-edit'].value = todos[id].text;
    editId = id;
}

formEdit.addEventListener('submit', (e) => {
    e.preventDefault();
    let todoEditText = formEdit['input-edit'].value.trim();

    if (todoEditText.length) {
        todos[editId].text = todoEditText;
        todos[editId].time = mainDate(); // Update the time
        setTodos();
        formEdit.reset();
        modalClose();
    } else {
        dangerText('message-edit', 'Please, Enter some todo...');
    }
});

// close modal
function modalClose() {
    modal.style.display = 'none';
    overlay.style.display = 'none';
}

closeEl.addEventListener('click', modalClose);

// Todo bajarilganligini belgilash
function setCompleted(id) {
    todos[id].completed = !todos[id].completed;
    setTodos();
}

