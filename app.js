import { generate } from 'https://cdn.jsdelivr.net/npm/random-words@2.0.0/+esm';

//Testing method
//console.log(generate({minLength : 5, maxLength : 5 }));

//Define the secret random word
const secretWord = generate({minLength : 5, maxLength : 5 });

// Initialize the game state
let attempts = 0;
let maxAttempts = 0;
let guessedWord = "_____"; // Initialize to match the length of the secret word

// DOM elements
const letterSquares = document.querySelectorAll(".letter-square");
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const resultDisplay = document.getElementById("result");
const difficultySelector = document.getElementById("difficulty");

// Function to update the word display
function updateWordDisplay() {
    for (let i = 0; i < secretWord.length; i++) {
        letterSquares[i].textContent = guessedWord[i];
    }
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
    
    attempts = 0;
    guessedWord = "_".repeat(secretWord.length);
    guessButton.disabled = false;
    resultDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}`;
    updateWordDisplay();
}

// Function to handle a guess
function handleGuess() {
    const guess = guessInput.value.trim().toLowerCase(); // Trim whitespace and convert to lowercase

    // Validate the guess using a regular expression
    if (!/^[a-zA-Z]+$/.test(guess)) {
        resultDisplay.textContent = "Guess must contain only letters (A-Z).";
        return;
    }

    if (guess.length !== secretWord.length) {
        resultDisplay.textContent = "Guess must be the same length as the secret word.";
        return;
    }

    attempts++;

    for (let i = 0; i < secretWord.length; i++) {
        if (secretWord[i] === guess[i]) {
            guessedWord = guessedWord.substring(0, i) + guess[i] + guessedWord.substring(i + 1);
        }
    }

    updateWordDisplay();

    if (guessedWord === secretWord) {
        resultDisplay.textContent = `Congratulations! You guessed the word "${secretWord}" in ${attempts} attempts.`;
        guessButton.disabled = true;
    } else if (attempts === maxAttempts) {
        resultDisplay.textContent = `Game over! The secret word was "${secretWord}".`;
        guessButton.disabled = true;
    } else {
        resultDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}`;
    }

    guessInput.value = "";
}

// Event listener for the guess button
guessButton.addEventListener("click", handleGuess);

// Event listeners for difficulty buttons
document.getElementById("easy-button").addEventListener("click", function() {
    setDifficulty("easy");
    document.querySelectorAll(".difficulty-button").forEach(button => button.classList.remove("selected"));
    this.classList.add("selected");
    resultDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}`;
});

document.getElementById("medium-button").addEventListener("click", function() {
    setDifficulty("medium");
    document.querySelectorAll(".difficulty-button").forEach(button => button.classList.remove("selected"));
    this.classList.add("selected");
    resultDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}`;
});

document.getElementById("hard-button").addEventListener("click", function() {
    setDifficulty("hard");
    document.querySelectorAll(".difficulty-button").forEach(button => button.classList.remove("selected"));
    this.classList.add("selected");
    resultDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}`;
});

// Initialize the game with medium difficulty as the default
setDifficulty("medium");
