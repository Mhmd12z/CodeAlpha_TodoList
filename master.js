let taskSection = document.querySelectorAll(".dashboard ul li");
let addListBtn = document.querySelector("#addList");

document.querySelector("#secInput").addEventListener("keypress", function () {
    document.querySelector("#secInput").style.backgroundColor = "rgba(107, 106, 106, 0.722)";
})
let addTaskBtn = document.querySelector("#btnAddTodo");
let tasks = document.querySelector(".tasks .tasksContainer");
let tasksArr = [];
function deleteTask(task, id) {
    setTimeout(() => {
        task.parentElement.remove();
    }, 500);
    task.parentElement.style.cssText = `
    animation-name: toRight;
    animation-duration: .5s;
    animation-fill-mode: both;
    animation-play-state: running;
    `
    let newArr = tasksArr.filter(task => {
        return task.id != id;
    });
    tasksArr = newArr;
    window.localStorage.setItem("tasks", JSON.stringify(tasksArr));
    displayMsg();
}
addTaskBtn.addEventListener("click", function () {
    if (document.querySelector(".tasks .taskInput").value === "") {
        document.querySelector(".tasks .taskInput").style.backgroundColor = "pink";
    }
    else {
        let obj = {
            id: Date.now(),
            class: document.querySelector(".tasks .taskInput").getAttribute('class').split(' ')[1],
            value: document.querySelector(".tasks .taskInput").value,
            date: new Date().toLocaleDateString(),
            completed: false
        }
        tasksArr.push(obj);
        getTaskData(obj);
        window.localStorage.setItem("tasks", JSON.stringify(tasksArr));
        document.querySelector(".tasks .taskInput").value = "";
    }
    displayMsg();
})
window.onload = function () {
    if (localStorage.tasks) {
        let arr = JSON.parse(localStorage.tasks);
        for (let i = 0; i < arr.length; i++) {
            tasksArr.push(arr[i]);
        }
        arr.forEach(el => {
            getTaskData(el);
        });
        if (localStorage["dashClass"] !== undefined) {
            document.querySelector(".dashboard").classList.add(localStorage["dashClass"]);
            document.querySelector(".content").classList.add(localStorage["contClass"]);
        }
        checkDone();
    }
    displayMsg();
}
function displayMsg() {
    if (tasksArr.length != 0) {
        document.querySelector(".tasksContainer h3").style.cssText = `
        animation-name: fadeOut;
    animation-duration: .3s;
    animation-fill-mode: both;
    animation-play-state: running;
        `;
        setTimeout(() => {
            document.querySelector(".tasksContainer h3").classList.add("closeMsg");
        }, 500)
    }
    else {
        document.querySelector(".tasksContainer h3").style.cssText = `
        animation-name: fadeIn;
    animation-duration: .3s;
    animation-fill-mode: both;
    animation-play-state: running;
        `;
        setTimeout(() => {
            document.querySelector(".tasksContainer h3").classList.remove("closeMsg");
        }, 500)
    }
}

function addTaskInfo(id, c, v, d) {
    return `
<li class="${c}" id="${id}">
<i id="taskCheck" class="fa-regular fa-circle doneStatus"></i>
<div class="date">${d}</div>
<i id="deleteTask" class="fa-solid fa-x" onclick="deleteTask(this,${id})"></i>
<i id="editTask" class="fa-solid fa-pen editBtn"></i>
<textarea readonly cols="80" rows="1" class="text">${v}</textarea>
</li>
`
}
function taskEditing(el, id) {
    getTextArea();
}
tasks.addEventListener("click", function (event) {
    let target = event.target;
    if (target.classList.contains("editBtn")) {
        let txtArea = target.nextElementSibling;
        target.classList.toggle("fa-save");
        target.classList.toggle("fa-pen");
        txtArea.toggleAttribute("readonly");
        txtArea.focus();
        for (let i = 0; i < tasksArr.length; i++) {
            if (target.parentElement.id == tasksArr[i].id) {
                tasksArr[i].value = txtArea.value;
            }
        }
    }
    if (target.classList.contains("doneStatus")) {
        for (let i = 0; i < tasksArr.length; i++) {
            if (tasksArr[i].id == target.parentElement.id) {
                if (tasksArr[i].completed) {
                    tasksArr[i].completed = false;
                    target.parentElement.classList.remove("done");
                } else {
                    tasksArr[i].completed = true;
                    target.parentElement.classList.add("done");
                }
            }
        }
    }
    localStorage.tasks = JSON.stringify(tasksArr);
})
function checkDone() {
    for (let i = 0; i < tasksArr.length; i++) {
        checkSameId(tasksArr[i]);
    }
}
function checkSameId(el) {
    let todoTasks = document.querySelectorAll(".tasksContainer li");
    for (let i = 0; i < todoTasks.length; i++) {
        if (el.id == todoTasks[i].id) {
            if (el.completed == true) {
                todoTasks[i].classList.add("done");
            } else {
                todoTasks[i].classList.remove("done");
            }
        }
    }
    return false;
}
function getTaskData(obj) {
    let task = addTaskInfo(obj.id, obj.class, obj.value, obj.date);
    tasks.innerHTML += task;
}
document.querySelector(".tasks .taskInput").addEventListener("keypress", () => {
    document.querySelector(".tasks .taskInput").style.backgroundColor = "#252525";
})
function secChange(el, prio) {
    for (let i = 0; i < document.querySelectorAll(".dashboard ul li").length; i++) {
        document.querySelectorAll(".dashboard ul li")[i].classList.remove("active");
    }
    el.classList.add("active");
    document.querySelector(".tasks .taskInput").classList.remove("low");
    document.querySelector(".tasks .taskInput").classList.remove("normal");
    document.querySelector(".tasks .taskInput").classList.remove("imp");
    document.querySelector(".tasks .taskInput").classList.remove("high");
    document.querySelector(".tasks .taskInput").classList.remove("v-high");
    document.querySelector(".tasks .taskInput").classList.add(prio);
}
function handleScreenSizes() {
    document.querySelector(".dashboard").classList.toggle("closedMenu");
    document.querySelector(".content").classList.toggle("full");
    localStorage.setItem("dashClass", document.querySelector(".dashboard").getAttribute("class").split(" ")[1]);
    localStorage.setItem("contClass", document.querySelector(".content").getAttribute("class").split(" ")[2]);
}
document.querySelector("#menuIcon").addEventListener("click", function () {
    handleScreenSizes();
})
document.querySelector(".content").addEventListener("click", () => {
    if (!document.querySelector(".dashboard").classList.contains("closedMenu"))
        handleScreenSizes();
})
let clearAllBtn = document.querySelector("#clearAllBtn");
clearAllBtn.addEventListener("click", () => {
    let tasksItems = document.querySelectorAll(".tasksContainer li");
    for (let i = 0; i < tasksItems.length; i++) {
        deleteTask(tasksItems[i].firstElementChild, tasksItems[i].id);
    }
})