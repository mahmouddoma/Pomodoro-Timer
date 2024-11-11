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

const alarmSound = new Audio("./audio/siren-alert-96052.mp3");

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);
addTodoBtn.addEventListener("click", addTodo);
stopSoundBtn.addEventListener("click", stopSound);

stopSoundBtn.style.display = "none";

window.addEventListener("DOMContentLoaded", () => {
  const selectedTime = document.getElementById("timer-duration").value;
  timeLeft = selectedTime * 60;
  updateDisplay();
});

function startTimer() {
  // Get the selected time from the dropdown
  const selectedTime = document.getElementById("timer-duration").value;
  timeLeft = selectedTime * 60; // Convert minutes to seconds

  if (!timerInterval) {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
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
    const listItem = document.createElement("li");

    // Create the task text span
    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;
    listItem.appendChild(taskSpan);

    // Add a "complete" button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Complete";
    completeBtn.addEventListener("click", () => {
      listItem.classList.toggle("completed");
    });

    // Add a "remove" button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      todoList.removeChild(listItem);
    });

    listItem.appendChild(completeBtn);
    listItem.appendChild(removeBtn);
    todoList.appendChild(listItem);

    todoInput.value = "";
  }
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
