const listContainer = document.getElementById("list-container");
const inputBox = document.getElementById("input-box");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document.getElementById("add-btn").addEventListener("click", addTask);
addEventListener("keydown", (e) => {
  // Enter adds task if input is focused, Ctrl+Enter always adds if input not empty
  if (
    (e.key === "Enter" && document.activeElement === inputBox && inputBox.value.trim()) ||
    (e.ctrlKey && e.key === "Enter" && inputBox.value.trim())
  ) {
    addTask();
  }
});


document.getElementById("clear-completed").addEventListener("click", removeCompletedTasks);
document.getElementById("delete-all").addEventListener("click", deleteAllData);

function addTask() {
  const taskText = inputBox.value.trim();
  const dueDate = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;

  // Prevents duplicate tasks
  if (tasks.some(task => task.text === taskText)) {
  alert("Task already exists!");
  return;
  }

  if (taskText === "") {
    alert("Can't add an empty tasks!");
    return;
  } else {
    tasks.push({
      text: taskText,
      completed: false,
      dueDate: dueDate || null,
      priority: priority || "low"
    });
    saveData();
  }
  inputBox.value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("priority").value = "low";
  showData();
}

function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteAllData() {
  if (!confirm("Are you sure you want to delete all tasks?")) return;
  tasks = [];
  saveData();
  showData();
}

listContainer.addEventListener("click", (e) => {
  const targetElement = e.target;

  // Toggle task completion
  if (targetElement.classList.contains("task-text") && !targetElement.isContentEditable) {
    const index = targetElement.getAttribute("data-index");
    tasks[index].completed = !tasks[index].completed;
    saveData();
    showData();
  }

  // Delete a specific task
  if (targetElement.classList.contains("delete-btn")) {
    const index = targetElement.getAttribute("data-index");
    deleteItem(index);
    showData();
  }

  // Edit a specific task (Edit button clicked)
  if (targetElement.classList.contains("edit-btn")) {
    const taskDiv = targetElement.previousElementSibling;
    editTask(taskDiv);
  }
});

function deleteItem(index) {
  tasks.splice(index,1);
  saveData();
}

function editTask(taskDiv) {
  const index = taskDiv.getAttribute("data-index");
  const originalText = tasks[index].text;

  const input = document.createElement("input");
  input.type = "text";
  input.value = originalText;
  input.classList.add("edit-input");

  taskDiv.replaceWith(input);
  input.focus();

  input.addEventListener("blur", () => saveEditedTask(input, index));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEditedTask(input, index);
  });
}

function saveEditedTask(input, index) {
  const newText = input.value.trim();
  if (newText !== "") {
    tasks[index].text = newText;
  }
  saveData();
  showData();
}

function showData() {
  listContainer.innerHTML = "";

  // Added the task counter update here
  const counter = document.getElementById("task-counter");
  if (counter) {
    const completed = tasks.filter(t => t.completed).length;
    counter.textContent = `Total: ${tasks.length} | Completed: ${completed}`;
  }

  if (tasks.length === 0) {
  const emptyMsg = document.createElement("div");
  emptyMsg.textContent = "No tasks yet! 🎉";
  emptyMsg.style.textAlign = "center";
  emptyMsg.style.color = "#aaa";
  emptyMsg.style.padding = "2rem 0";
  listContainer.appendChild(emptyMsg);
  return;
 }
  
  tasks.forEach((task, index) => {
    let li = document.createElement("li");

    const taskDiv = document.createElement("div");
    taskDiv.setAttribute("data-index", index);
    taskDiv.classList.add("task-text");
    taskDiv.textContent = task.text;
    if (task.completed) {
      taskDiv.classList.add("checked");
    }

    // Shows due date (if any)
    if (task.dueDate) {
      const dueDateElement = document.createElement("div");
      dueDateElement.classList.add("due-date");
      dueDateElement.textContent = `Due: ${formatDate(task.dueDate)}`;
      taskDiv.appendChild(dueDateElement);
    }

    // Shows priority of task
    if (task.priority) {
      const priorityElement = document.createElement("div");
      priorityElement.classList.add("priority");
      priorityElement.textContent = `Priority: ${task.priority}`;
      taskDiv.appendChild(priorityElement);
    }

    li.appendChild(taskDiv);

    // Added Edit Icon Button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.setAttribute("data-index", index);
    editButton.innerHTML = "<i class='fas fa-edit'></i>";
    li.appendChild(editButton);

    // Added Delete Icon Button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.setAttribute("data-index", index);
    deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
    li.appendChild(deleteButton);

    listContainer.appendChild(li);
  });
}

function removeCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveData();
  showData();
}

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');

if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener('change', function () {
  if (this.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
  }
});

// Initial rendering of the task list
showData();
