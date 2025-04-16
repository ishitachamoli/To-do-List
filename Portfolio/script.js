const listContainer = document.getElementById("list-container");
const inputBox = document.getElementById("input-box");
let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Load tasks from localStorage or set to an empty array

document.getElementById("add-btn").addEventListener("click", addTask);
addEventListener("keydown", (e) => {
  if (e.key === "Enter" && inputBox.value.trim()) {
    addTask();
  }
});

// Clear completed tasks
document
  .getElementById("clear-completed")
  .addEventListener("click", removeCompletedTasks);

document.getElementById("delete-all").addEventListener("click", deleteAllData);

function addTask() {
  const taskText = inputBox.value.trim();
  if (taskText === "") {
    alert("Can't add an empty task!");
  } else {
    tasks.push({ text: taskText, completed: false }); // Add task with a completed flag
    saveData();
  }
  inputBox.value = ""; // Clear input
  showData(); // Display updated tasks
}

// Save tasks to localStorage
function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete all tasks
function deleteAllData() {
  tasks = [];
  saveData(); // Update localStorage
  showData(); // Refresh the list
}

// Mark tasks as completed, delete or edit them
listContainer.addEventListener("click", (e) => {
  const targetElement = e.target;

  // Toggle task completion
  if (targetElement.classList.contains("task-text") && !targetElement.isContentEditable) {
    const index = targetElement.getAttribute("data-index");
    tasks[index].completed = !tasks[index].completed; // Toggle completion status
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

// Remove a specific task
function deleteItem(index) {
  tasks.splice(index, 1); // Remove task at index
  saveData(); // Update localStorage
}

// Edit task (on Edit button click)
function editTask(taskDiv) {
  const index = taskDiv.getAttribute("data-index");
  const originalText = tasks[index].text;
  
  // Create input field to replace task text
  const input = document.createElement("input");
  input.type = "text";
  input.value = originalText;
  input.classList.add("edit-input");

  taskDiv.replaceWith(input); // Replace div with input field

  input.focus(); // Focus on input field

  // Save on pressing "Enter" or losing focus
  input.addEventListener("blur", () => saveEditedTask(input, index));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEditedTask(input, index);
  });
}

// Save the edited task
function saveEditedTask(input, index) {
  const newText = input.value.trim();
  if (newText !== "") {
    tasks[index].text = newText; // Update task text
  }
  saveData(); // Update localStorage
  showData(); // Re-render tasks
}

// Display tasks in the DOM
function showData() {
  listContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    let li = document.createElement("li");

    const taskDiv = document.createElement("div");
    taskDiv.setAttribute("data-index", index);
    taskDiv.classList.add("task-text");
    taskDiv.textContent = task.text;
    if (task.completed) {
      taskDiv.classList.add("checked"); // Add 'checked' class if the task is completed
    }
    li.appendChild(taskDiv);

    // Add Edit Icon Button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.setAttribute("data-index", index);
    editButton.innerHTML = "<i class='fas fa-edit'></i>"; // Font Awesome edit icon
    li.appendChild(editButton);

    // Add Delete Icon Button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.setAttribute("data-index", index);
    deleteButton.innerHTML = "<i class='fas fa-trash'></i>"; // Font Awesome trash icon
    li.appendChild(deleteButton);

    listContainer.appendChild(li);
  });
}

// Remove all completed tasks
function removeCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed); // Keep only non-completed tasks
  saveData(); // Update localStorage
  showData(); // Refresh the list
}

// Initial rendering of the task list
showData();