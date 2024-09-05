import { generate } from "https://cdn.jsdelivr.net/npm/random-words@2.0.0/+esm";

//Define the secret random word
const startTime = performance.now();
console.log(startTime);
const secretWord = generate({ minLength: 5, maxLength: 5 });
const endTime = performance.now();
console.log(endTime);

console.log(endTime - startTime);
//const secretWord = 'waste';
const domain = process.env.domain || "http://localhost:3000/";
// Check Word Validity
async function checkWordValidity(word) {
  try {
    const response = await fetch(`${domain}check-word?word=${word}`);
    const data = await response.json();
    if (data.results.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Initialize the game state
let attempts = 0;
let maxAttempts = 0;
let rowNumber = 0;
let guessedWord = "_____"; // Initialize to match the length of the secret word

// DOM elements
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const resultDisplay = document.getElementById("result");
const testDisplay = document.getElementById("test");
const keyButtons = Array.from(
  document.getElementsByClassName("keyboard-button")
);

// Function to get number of instances a letter appears in a word
function getLetterInstances(letter, word) {
  let instances = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      instances++;
    }
  }
  return instances;
}

// Function to get the position of a letter in a word
function getLetterPosition(letter, word, index) {
  let position = 0;
  for (let i = 0; i <= index; i++) {
    if (word[i] === letter) {
      position++;
    }
  }
  return position;
}

function clickKeyButton(button) {
  if (button.textContent === "ENTER") {
    handleGuess();
  } else if (button.textContent === "DEL") {
    if (guessInput.value !== null) {
      guessInput.value = guessInput.value.slice(0, -1);
    }
  } else {
    guessInput.value += button.textContent;
  }
  guessInput.focus();
}

function colorKeyButton(letter, color) {
  for (const element of document.getElementsByClassName("keyboard-button")) {
    console.log(
      `Letter: ${letter}, Button Text: ${element.textContent}, Current Color: ${element.style.backgroundColor}, New Color: ${color}`
    );
    if (element.textContent.toLowerCase() === letter) {
      if (element.style.backgroundColor === "forestgreen") {
        return;
      }
      if (
        element.style.backgroundColor === "mediumvioletred" &&
        color !== "forestgreen"
      ) {
        return;
      }
      if (color === "#508d9c") {
        if (element.style.backgroundColor === "dimgray") {
          return;
        } else {
          console.log(`Setting button color to grey.`);
          element.style.backgroundColor = "dimgray";
          return;
        }
      }
      console.log(`Matching button found.`);
      console.log(
        `Before setting color - Current Color: ${element.style.backgroundColor}, New Color: ${color}`
      );
      element.style.backgroundColor = color;
      console.log(
        `After setting color - Current Color: ${element.style.backgroundColor}, New Color: ${color}`
      );
      break;
    }
  }
}

// Function to update the word display
function updateWordDisplay(rowIndex) {
  const letterRow = document.querySelectorAll(".letter-row")[rowIndex];
  const letterSquares = letterRow.querySelectorAll(".letter-square");
  const animationDuration = 500;

  for (let i = 0; i < secretWord.length; i++) {
    let lettercolor = "";
    let letter = guessedWord[i];
    let box = letterSquares[i];
    box.textContent = guessedWord[i];
    box.classList.add("animated");
    box.style.animationDelay = `${(i * animationDuration) / 2}ms`;

    const letterInstancesSecret = getLetterInstances(
      box.textContent,
      secretWord
    );
    const letterInstancesGuess = getLetterInstances(
      box.textContent,
      guessedWord
    );
    const letterPosition = getLetterPosition(box.textContent, guessedWord, i);

    if (
      letterInstancesGuess > letterInstancesSecret &&
      letterPosition > letterInstancesSecret
    ) {
      if (guessedWord[i] === secretWord[i]) {
        //Case of word with 2 letters. first in wrong position (purple), second in correct position (stays blue).
        lettercolor = "forestgreen";
      } else {
        lettercolor = "#508d9c";
      }
    } else if (guessedWord[i] === secretWord[i]) {
      lettercolor = "forestgreen";
    } else if (secretWord.includes(guessedWord[i])) {
      lettercolor = "mediumvioletred";
    } else {
      lettercolor = "#508d9c";
    }
    setTimeout(() => {
      box.style.backgroundColor = lettercolor;
      colorKeyButton(letter, lettercolor);
    }, ((i + 1) * animationDuration) / 2);
  }

  rowIndex++;
}

// Function to set difficulty level and reset the game
function setDifficulty(difficulty) {
  switch (difficulty) {
    case "easy":
      maxAttempts = 8;
      break;
    case "medium":
      maxAttempts = 6;
      break;
    case "hard":
      maxAttempts = 4;
      break;
    default:
      maxAttempts = 6; // Default to medium difficulty
      break;
  }

  const numberOfRows = maxAttempts;
  document.querySelector(".word-display").innerHTML = "";

  // Generate letter rows based on difficulty selected by user
  for (let i = 0; i < numberOfRows; i++) {
    const row = document.createElement("div");
    row.classList.add("letter-row");
    document.querySelector(".word-display").appendChild(row);

    // Generate 5 letter squares per letter row
    for (let j = 0; j < 5; j++) {
      const square = document.createElement("div");
      square.classList.add("letter-square");
      row.appendChild(square);
    }
  }

  attempts = 0;
  guessButton.disabled = false;
  resultDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}`;
  //testDisplay.textContent = 'Test word: ' + secretWord;
}

// Function to handle a guess
async function handleGuess() {
  const guess = guessInput.value.trim().toLowerCase(); // Trim whitespace and convert to lowercase
  const isValid = await checkWordValidity(guess);

  // Validate the guess using a regular expression
  if (!/^[a-zA-Z]+$/.test(guess)) {
    resultDisplay.textContent = "Guess must contain only letters (A-Z).";
    return;
  }

  if (guess.length !== secretWord.length) {
    resultDisplay.textContent =
      "Guess must be the same length as the secret word.";
    return;
  }

  if (!isValid) {
    resultDisplay.textContent = "Word does not exist!";
    return;
  }

  guessedWord = guess;
  attempts++;

  updateWordDisplay(rowNumber);

  if (guessedWord === secretWord) {
    resultDisplay.textContent = `Congratulations! You guessed the word "${secretWord}" in ${attempts} attempts.`;
    resultDisplay.classList.add("win-animation");
    guessButton.disabled = true;
  } else if (attempts === maxAttempts) {
    resultDisplay.textContent = `Game over! The secret word was "${secretWord}".`;
    resultDisplay.classList.add("loser-animation");
    guessButton.disabled = true;
  } else {
    rowNumber++;
    resultDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}`;
  }

  guessInput.value = "";
  guessedWord = "_____";
}

async function checkWordValidity(guess) {
  try {
    const response = await fetch(
      `https://wordsapiv1.p.rapidapi.com/words/${guess}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
          "X-RapidAPI-Key": API_KEY,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.results.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      console.error("Error:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

// Event listeners for difficulty buttons
document.getElementById("easy-button").addEventListener("click", function () {
  setDifficulty("easy");
  document
    .querySelectorAll(".difficulty-button")
    .forEach((button) => button.classList.remove("selected"));
  this.classList.add("selected");
  resultDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}`;
});

document.getElementById("medium-button").addEventListener("click", function () {
  setDifficulty("medium");
  document
    .querySelectorAll(".difficulty-button")
    .forEach((button) => button.classList.remove("selected"));
  this.classList.add("selected");
  resultDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}`;
});

document.getElementById("hard-button").addEventListener("click", function () {
  setDifficulty("hard");
  document
    .querySelectorAll(".difficulty-button")
    .forEach((button) => button.classList.remove("selected"));
  this.classList.add("selected");
  resultDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}`;
});

// Initialize the game with medium difficulty as the default
setDifficulty("medium");
guessInput.focus();

// Event listeners for the guess button and input field
guessButton.addEventListener("click", handleGuess);
guessInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleGuess();
  }
});

for (const button of keyButtons) {
  button.addEventListener("click", () => clickKeyButton(button));
}
