let inputField = document.querySelector(".add-task input"),
  addBtn = document.querySelector(".add-task .add"),
  tasksContainer = document.querySelector(".tasks-content"),
  noTasksMsg = document.querySelector(".no-tasks-msg"),
  tasksCount = document.querySelector(".tasks-count span"),
  completedTasksCount = document.querySelector(".tasks-completed span"),
  tasksList = [];

class Task {
  constructor(title) {
    this.title = title;
    this.completeState = false;
    this.taskId = Date.now();
  }
}

retrieveTasksFromLocalStorage();

window.onload = () => inputField.focus();
document.addEventListener("click", (e) => {
  if (e.target.className === "delete") {
    updateTasksList(e.target.parentElement.dataset.id, 1);
    if (e.target.parentElement.classList.contains("completed")) {
      completedTasksCount.innerHTML =
        parseInt(completedTasksCount.innerHTML) - 1;
    }
    tasksCount.innerHTML = parseInt(tasksCount.innerHTML) - 1;
    e.target.parentElement.remove();
    if (tasksContainer.innerHTML === "") {
      let noTaskSpan = document.createElement("span");
      noTaskSpan.className = "no-tasks-msg";
      noTaskSpan.appendChild(document.createTextNode("No Tasks To Show"));
      tasksContainer.appendChild(noTaskSpan);
    }
  }
  if (e.target.classList.contains("task-box")) {
    e.target.classList.toggle("completed");
    updateTasksList(e.target.dataset.id);
  }
});

inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addBtn.click();
});
addBtn.onclick = () => {
  if (inputField.value.trim() !== "") {
    noTasksMsg.remove();
    addTaskToTasksList(inputField.value.trim());
    addTasksToLocalStorage();
    addTasksToPage();
    tasksCount.innerHTML = parseInt(tasksCount.innerHTML) + 1;
  } else {
    Swal.fire({
      title: "You entered empty task.",
      text: "Please enter a task !",
      icon: "warning",
    });
  }
};

function addTaskToTasksList(inputText) {
  const task = new Task(inputText);
  tasksList.push(task);
}
function addTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasksList));
}
function addTasksToPage() {
  tasksContainer.innerHTML = "";
  tasksList.forEach(({ title, taskId, completeState }) => {
    let taskBox = document.createElement("span");
    let deleteBtn = document.createElement("span");
    taskBox.className = "task-box";
    if (completeState === true) {
      taskBox.classList.add("completed");
    }
    taskBox.dataset.id = taskId;
    deleteBtn.className = "delete";
    deleteBtn.innerHTML = "delete";
    taskBox.append(document.createTextNode(title), deleteBtn);
    tasksContainer.appendChild(taskBox);
  });
}
function retrieveTasksFromLocalStorage() {
  if (
    localStorage.getItem("tasks") !== null &&
    JSON.parse(localStorage.getItem("tasks")).length !== 0
  ) {
    tasksList = JSON.parse(localStorage.getItem("tasks"));
    addTasksToPage();
    tasksCount.innerHTML = tasksList.length;
    completedTasksCount.innerHTML = tasksList.filter(
      ({ completeState }) => completeState === true
    ).length;
  }
}
function updateTasksList(id, option = 0) {
  // if Option value = 1 ==> remove Element
  // if Option value = 0 ==> update complete state
  if (!option) {
    // Update Task
    let taskIndex = tasksList.findIndex(({ taskId }) => taskId == id);
    if (tasksList[taskIndex].completeState) {
      tasksList[taskIndex].completeState = false;
      completedTasksCount.innerHTML =
        parseInt(completedTasksCount.innerHTML) - 1;
    } else {
      tasksList[taskIndex].completeState = true;
      completedTasksCount.innerHTML =
        parseInt(completedTasksCount.innerHTML) + 1;
    }
  } else {
    // Remove Task
    tasksList = tasksList.filter(({ taskId }) => taskId != id);
  }
  addTasksToLocalStorage();
}
