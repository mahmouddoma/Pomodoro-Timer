let timerInterval;
let timeLeft;

const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("add-todo-btn");
const todoList = document.getElementById("todo-list");
const stopSoundBtn = document.getElementById("stop-sound-btn");
const pauseBtn = document.getElementById("pause-btn");

const alarmSound = new Audio("./audio/siren-alert-96052.mp3");

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);
addTodoBtn.addEventListener("click", addTodo);
stopSoundBtn.addEventListener("click", stopSound);

stopSoundBtn.style.display = "none";

// Load data on page load
window.addEventListener("DOMContentLoaded", () => {
  loadTimerState();
  loadTodoList();
  updateDisplay();
});

function startTimer() {
  const selectedTime = document.getElementById("timer-duration").value;

  // Set timeLeft only if not already running
  if (!timerInterval && timeLeft === 0) {
    timeLeft = selectedTime * 60; // Convert minutes to seconds
  }

  if (!timerInterval) {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
        saveTimerState(); // Save timer progress
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alarmSound.play();
        showStopButton(); // Show the stop sound button when time is up
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  const selectedTime = document.getElementById("timer-duration").value;
  timeLeft = selectedTime * 60; // Reset to selected time
  updateDisplay();
  saveTimerState(); // Save timer reset
  hideStopButton(); // Hide the stop sound button when timer is reset
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  minutesDisplay.textContent = String(minutes).padStart(2, "0");
  secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

function addTodo() {
  const taskText = todoInput.value.trim();
  if (taskText !== "") {
    const listItem = createTodoItem(taskText, false);
    todoList.appendChild(listItem);
    todoInput.value = "";
    saveTodoList(); // Save updated to-do list
  }
}

function createTodoItem(text, completed) {
  const listItem = document.createElement("li");

  // Create the task text span
  const taskSpan = document.createElement("span");
  taskSpan.textContent = text;
  listItem.appendChild(taskSpan);

  // Add a "complete" button
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Complete";
  completeBtn.addEventListener("click", () => {
    listItem.classList.toggle("completed");
    saveTodoList(); // Save updated to-do list
  });

  // Add a "remove" button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => {
    todoList.removeChild(listItem);
    saveTodoList(); // Save updated to-do list
  });

  if (completed) {
    listItem.classList.add("completed");
  }

  listItem.appendChild(completeBtn);
  listItem.appendChild(removeBtn);
  return listItem;
}

function showStopButton() {
  stopSoundBtn.style.display = "inline-block"; // Show stop sound button when time ends
}

function hideStopButton() {
  stopSoundBtn.style.display = "none"; // Hide stop sound button when timer is reset
}

function stopSound() {
  alarmSound.pause(); // Stop the sound
  alarmSound.currentTime = 0; // Reset the sound to the start
  hideStopButton(); // Hide the button after stopping the sound
}

// Save timer state to localStorage
function saveTimerState() {
  localStorage.setItem("timerState", JSON.stringify({ timeLeft }));
}

// Load timer state from localStorage
function loadTimerState() {
  const savedState = JSON.parse(localStorage.getItem("timerState"));
  timeLeft = savedState?.timeLeft || 0; // Default to 0 if no saved state
}

// Save to-do list to localStorage
function saveTodoList() {
  const todos = Array.from(todoList.children).map((item) => ({
    text: item.querySelector("span").textContent,
    completed: item.classList.contains("completed"),
  }));
  localStorage.setItem("todoList", JSON.stringify(todos));
}

// Load to-do list from localStorage
function loadTodoList() {
  const savedTodos = JSON.parse(localStorage.getItem("todoList"));
  if (savedTodos) {
    savedTodos.forEach((todo) => {
      const listItem = createTodoItem(todo.text, todo.completed);
      todoList.appendChild(listItem);
    });
  }
}

//pause button
pauseBtn.addEventListener("click", pauseTimer);

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}
