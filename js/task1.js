const MIN_NUMBER = 1;
const MAX_NUMBER = 100;
const START_LIVES = 3;
const WIN_STREAK = 5;
const MAX_HINTS = 1;
const MIDDLE_NUMBER = 50;
const ZERO = 0;

let currentNumber = ZERO;
let nextNumber = ZERO;
let lives = START_LIVES;
let streak = ZERO;
let bestStreak = ZERO;
let hintsLeft = MAX_HINTS;
let isGameOver = false;

const currentNumEl = document.querySelector("#current-number");
const livesEl = document.querySelector("#lives-count");
const streakEl = document.querySelector("#streak-count");
const bestStreakEl = document.querySelector("#best-streak");
const hintsEl = document.querySelector("#hints-left");
const gameMessage = document.querySelector("#game-message");
const rangeTextEl = document.querySelector("#range-text");
const targetTextEl = document.querySelector("#target-text");

const btnHigher = document.querySelector("#btn-higher");
const btnLower = document.querySelector("#btn-lower");
const btnHint = document.querySelector("#btn-hint");
const btnRestart = document.querySelector("#btn-restart");

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showGameMessage(text, statusClass) {
  gameMessage.textContent = text;
  gameMessage.classList.remove("status-neutral", "status-win", "status-loss", "status-warning");
  gameMessage.classList.add(statusClass);
}

function updateScreen() {
  rangeTextEl.textContent = MIN_NUMBER + " до " + MAX_NUMBER;
  targetTextEl.textContent = WIN_STREAK;

  currentNumEl.textContent = currentNumber;
  livesEl.textContent = lives;
  streakEl.textContent = streak;
  bestStreakEl.textContent = bestStreak;
  hintsEl.textContent = hintsLeft;
}

function makeGuess(choice) {
  if (isGameOver === true) {
    showGameMessage("Игра уже окончена! Нажмите «Начать заново».", "status-warning");
    return;
  }

  const isCorrect =
    (choice === "higher" && nextNumber >= currentNumber) ||
    (choice === "lower" && nextNumber <= currentNumber);

  if (isCorrect) {
    streak = streak + 1;
    if (streak > bestStreak) {
      bestStreak = streak;
    }
    showGameMessage("Верно! Выпало число " + nextNumber + ".", "status-win");
  } else {
    lives = lives - 1;
    streak = ZERO;
    showGameMessage("Неверно! Выпало число " + nextNumber + ". Минус 1 жизнь.", "status-loss");
  }

  currentNumber = nextNumber;
  nextNumber = getRandomNumber(MIN_NUMBER, MAX_NUMBER);

  if (streak === WIN_STREAK && lives > ZERO) {
    isGameOver = true;
    showGameMessage("Победа! Вы набрали серию из " + WIN_STREAK + " угадываний подряд!", "status-win");
  } else if (lives === ZERO) {
    isGameOver = true;
    showGameMessage("Поражение! Закончились жизни. Нажмите «Начать заново».", "status-loss");
  }

  updateScreen();
}

function useHint() {
  if (isGameOver === true || hintsLeft === ZERO) {
    showGameMessage("Недопустимый ход: подсказок больше нет или игра окончена!", "status-warning");
    return;
  }

  hintsLeft = hintsLeft - 1;
  if (nextNumber > MIDDLE_NUMBER) {
    showGameMessage("Подсказка: следующее число больше " + MIDDLE_NUMBER + ".", "status-neutral");
  } else {
    showGameMessage("Подсказка: следующее число " + MIDDLE_NUMBER + " или меньше.", "status-neutral");
  }
  updateScreen();
}

function startGame() {
  lives = START_LIVES;
  streak = ZERO;
  hintsLeft = MAX_HINTS;
  isGameOver = false;
  currentNumber = getRandomNumber(MIN_NUMBER, MAX_NUMBER);
  nextNumber = getRandomNumber(MIN_NUMBER, MAX_NUMBER);

  showGameMessage("Угадайте: следующее число будет больше или меньше текущего?", "status-neutral");
  updateScreen();
}

btnHigher.addEventListener("click", function () {
  makeGuess("higher");
});

btnLower.addEventListener("click", function () {
  makeGuess("lower");
});

btnHint.addEventListener("click", function () {
  useHint();
});

btnRestart.addEventListener("click", function () {
  startGame();
});

startGame();
