const add = document.querySelector("#add_todo");
const update = document.querySelector("#update");
const todoList = document.querySelector("#list");
const todo = document.querySelector("#add_text");
let updateText = document.querySelector("#txt_update");
const updateBtn = document.querySelector("#update_btn");
const addtodoWrapper = document.querySelector(".add_todo");
const messageBlock = document.querySelector("#messageblock");
const statusElement = document.querySelector("div>#status");
const cancelUpdate = document.getElementById("cancel_update");
const alltask = document.querySelector("#status>div>span:nth-child(1)");
const progressBar = document.querySelector("#status>div:nth-child(2)>div");
const completedTask = document.querySelector("#status>div>span:nth-child(2)");
const unCompletedTask = document.querySelector("#status>div>span:nth-child(3)");
"use strict";
let tasks = [];
let taskID = 0;
let tasksLen = 0;
const days = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه'];
const colors = ['lightseagreen', 'lightblue', 'lightgreen', 'lightyellow', 'lightcoral', 'lightsalmon'];

add.addEventListener("click", (e) => limitTask(JSON.parse(localStorage.getItem('tasks'))) < 100 && addToDo(e, true) );
todo.addEventListener("keypress", (e) => e.keyCode === 13 && limitTask(JSON.parse(localStorage.getItem('tasks'))) < 100 && addToDo(e, false));

window.addEventListener("load", () => {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks && tasks.length>0 && tasks.map(task =>
        createElement(task)
    )
    check();
    todo.focus();
    statusElement.setAttribute('id', '');
    statusOfElement(tasks, statusElement);
    statusElement.classList.add('hideElement');
    progressBar.innerHTML = limitTask(JSON.parse(localStorage.getItem('tasks'))) + '%';
})

function addToDo(e, nokeypress = true) {
    !nokeypress && e.preventDefault();
    let value;
    if (todo.value !== "")
        value = todo.value;
    else return;
    const task = {
        id: new Date().getTime(),
        todo: value,
        completed: false,
        color: '',
        timeStamp: getDay()
    }

    const colorIndex = Math.floor(Math.random() * 6);
    task.color = colors[colorIndex]
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    createElement(task);


}

function completeTask(e) {
    if (e.target.classList.contains('completeBtn')) {
        const taskId = e.target.closest('div').id;
        const taskIndex = tasks.findIndex((task, index) => {
            return String(task.id) === taskId
        })
        if (tasks[taskIndex].completed) {
            tasks[taskIndex].completed = false;
        } else {
            tasks[taskIndex].completed = true;

        }
        localStorage.setItem('tasks', JSON.stringify(tasks))
        check();

        tasks[taskIndex].completed ? e.target.parentElement.parentElement.classList.add('completed') : e.target.parentElement.parentElement.classList.remove('completed')
    }
}

function createElement(task) {

    const list = document.createElement(`li`);
    task.completed && list.classList.add('completed')
    list.classList.add('listItem')
    list.classList.add(task.color)
    list.innerHTML = `
    <span class=timeStamp>${task.timeStamp}</span>
    <span class=task>${task.todo}</span>
    <div class=actions id=${task.id}>
        <img src=images/remove.png class=closeBtn />
        <img src=./images/complete.png class=completeBtn />
        </div>
    `
    todoList.append(list)
    todo.value = "";
    todo.focus();
    check()
    statusElement.setAttribute('id', 'status')
    statusOfElement(tasks, statusElement);
    progressBar.innerHTML = limitTask(JSON.parse(localStorage.getItem('tasks'))) + '%';

}

todoList.addEventListener("click", (e) => completeTask(e))

cancelUpdate.addEventListener("click", () => {
    update.classList.add("hideElement")
    update.classList.remove("showElement")
    addtodoWrapper.classList.add('showElement')
    addtodoWrapper.classList.remove('hideElement')
})

updateBtn.addEventListener("click", () => {
    let updateTask = taskID &&
        tasks.findIndex(task => {
            return String(task.id) === taskID;
        })
    tasks[updateTask].todo = updateText.value;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    todoList.innerHTML = "";
    update.classList.add('hideElement')
    addtodoWrapper.classList.add('showElement')
    addtodoWrapper.classList.remove('hideElement')
    tasks.map(item => {
        createElement(item)
    })
})

list.addEventListener('click', (e) => {
    if (e.target.classList.contains('closeBtn')) {
        e.target.parentElement.parentElement.remove();
        removeItem(JSON.parse(e.target.closest('div').id))
        check();
    }

    if (e.target.classList.contains('task')) {
        const taskId = e.target.nextElementSibling.getAttribute('id')
        const taskIndex = tasks.findIndex(task => {
            return task.id === +taskId;
        })
        if (!tasks[taskIndex].completed) {
            update.classList.remove("hideElement")
            update.classList.add("showElement")
            addtodoWrapper.classList.remove('showElement')
            addtodoWrapper.classList.add('hideElement');
            updateText.focus();
        }

        const taskData = e.target.innerHTML;
        taskID = e.target.nextElementSibling.getAttribute("id");

        updateText.value = !tasks[taskIndex].completed ? taskData : (update.classList.add("hideElement") && update.classList.remove("showElement"));
    }


})

function removeItem(taskId) {
    const newItems = tasks.filter(item => item.id !== taskId);
    tasks.length = 0;
    tasks.push(...newItems);
    localStorage.removeItem('tasks');
    localStorage.setItem('tasks', JSON.stringify(tasks));
    statusOfElement(tasks, statusElement);
    progressBar.innerHTML = limitTask(JSON.parse(localStorage.getItem('tasks'))) + '%';

}


function getDay() {
    const date = new Date();
    const dayOfWeek = days[date.getDay()];
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${dayOfWeek} ${seconds} : ${minutes} : ${hour}`;
}

function status(tasks) {
    const allTasks = tasks.length;
    const completed = tasks.filter(task => {
        return task.completed
    }).length;
    const uncompleted = allTasks - completed;

    return [allTasks, completed, uncompleted]
}

function check() {
    const [all, completed, uncompleted] = status(tasks);
    alltask.innerText = all;
    completedTask.innerText = completed;
    unCompletedTask.innerText = uncompleted;
    progressBar.style.width = limitTask(JSON.parse(localStorage.getItem('tasks'))) + '%';
}

function limitTask(tasks) {
    if (tasks && tasks.length) {
        let tasksLen = tasks.length;
        tasksPersent = tasksLen * 10;
        return tasksLen <= 10 ? tasksPersent : false
    }
    return true
}

function statusOfElement(tasks, element) {
    if (!tasks.length) {
        element.classList.add('hideElement')
        element.classList.remove('showElement')
        element.setAttribute('id', '');
    }
    else {
        element.classList.add('showElement');
        element.classList.remove('hideElement');
        element.setAttribute('id', 'status')
    }
}

messageBlock.addEventListener("click", (e) => {
    e.target.parentElement.remove();

})