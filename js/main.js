let inputField = document.querySelector(".add-task input"),
  addBtn = document.querySelector(".add-task .add"),
  tasksContainer = document.querySelector(".tasks-content"),
  noTasksMsg = document.querySelector(".no-tasks-msg"),
  tasksCount = document.querySelector(".tasks-count span"),
  completedTasksCount = document.querySelector(".tasks-completed span"),
  tasksList = [];

let noTasksMsgClone = noTasksMsg.cloneNode(true);

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
  // Remove Task
  if (e.target.className === "delete") {
    updateTasksList(e.target.parentElement.dataset.id, 1);
    if (e.target.parentElement.classList.contains("completed")) {
      completedTasksCount.innerHTML =
        parseInt(completedTasksCount.innerHTML) - 1;
    }
    tasksCount.innerHTML = parseInt(tasksCount.innerHTML) - 1;
    e.target.parentElement.remove();
    if (tasksContainer.innerHTML === "") {
      tasksContainer.appendChild(noTasksMsgClone);
    }
  }
  // Finish Task
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
    inputField.value = "";
    tasksCount.innerHTML = parseInt(tasksCount.innerHTML) + 1;
  } else {
    fireSweetAlert(
      "Please enter a task !",
      "You entered empty task.",
      "warning"
    );
  }
};

document.getElementById("finish-all").onclick = () => {
  if (tasksContainer.getElementsByClassName("no-tasks-msg")[0]) {
    fireSweetAlert("No tasks to be finished.", "Warning", "error");
  } else {
    if (tasksList.every(({ completeState }) => completeState === true)) {
      // Every Task completed
      fireSweetAlert("All tasks are already finished.", "Warning", "error");
    } else {
      finishAllTasks();
    }
  }
};
document.getElementById("clear-all").onclick = () => {
  if (tasksContainer.getElementsByClassName("no-tasks-msg")[0]) {
    // No Tasks Msg Exists [ Truthy (not undefined) ]
    fireSweetAlert("No tasks to be cleared.", "Warning", "error");
  } else {
    // No Tasks Msg Doesn't Exist [ Falsy (Undefined) ]
    clearAllTasks();
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

/**
 * Updates Tasks List. Argument 2 (option) is optional and default value is 0 , 1 means remove task.
 * @author Hossam
 * @param {string}  id Id of the task
 * @param {number}  option  To delete task or update, default 0
 */
function updateTasksList(id, option = 0) {
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

function finishAllTasks() {
  tasksList.forEach((task) => {
    task.completeState = true;
  });
  addTasksToLocalStorage();
  addTasksToPage();
  completedTasksCount.innerHTML = tasksList.length;
  fireSweetAlert("All tasks are finished.", "", "success", 1500, false);
}

function clearAllTasks() {
  // Promise
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear();
      tasksList = [];
      completedTasksCount.innerHTML = "0";
      tasksCount.innerHTML = "0";
      tasksContainer.innerHTML = "";
      tasksContainer.appendChild(noTasksMsgClone);
      fireSweetAlert("", "Tasks Cleared.", "success", 1500, false);
    }
  });
}

function fireSweetAlert(
  text,
  title,
  icon,
  timer = 0,
  showConfirmButton = true
) {
  Swal.fire({
    icon,
    text,
    title,
    timer,
    showConfirmButton,
  });
}
