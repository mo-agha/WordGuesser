import { generate } from 'https://cdn.jsdelivr.net/npm/random-words@2.0.0/+esm';

//Testing method
//console.log(generate({minLength : 5, maxLength : 5 }));

//Define the secret random word
const secretWord = generate({minLength : 5, maxLength : 5 });

// Initialize the game state
let attempts = 0;
let maxAttempts = 0;
let rowNumber = 0;
// let correctPositions = []; // Array to hold letters in correct positions
let guessedWord = "_____"; // Initialize to match the length of the secret word

// DOM elements
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const resultDisplay = document.getElementById("result");

// Function to update the word display
function updateWordDisplay(rowIndex) {
    const letterRow = document.querySelectorAll('.letter-row')[rowIndex];
    const letterSquares = letterRow.querySelectorAll('.letter-square');

    for (let i = 0; i < secretWord.length; i++) {
        letterSquares[i].textContent = guessedWord[i];
        if(guessedWord[i] === secretWord[i]){
            letterSquares[i].style.backgroundColor = 'green';
        }
        else if(secretWord.includes(guessedWord[i])){
            letterSquares[i].style.backgroundColor = '#c034eb';
        }
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
    document.querySelector('.word-display').innerHTML = '';
    
    // Generate letter rows based on difficulty selected by user
    for(let i = 0; i < numberOfRows; i++){
        const row = document.createElement('div');
        row.classList.add('letter-row');
        document.querySelector('.word-display').appendChild(row);

        // Generate 5 letter squares per letter row
        for(let j = 0; j < 5; j++){ 
            const square = document.createElement('div');
            square.classList.add('letter-square');
            row.appendChild(square);
        }
    }

    attempts = 0;
    guessedWord = "_".repeat(secretWord.length);
    guessButton.disabled = false;
    resultDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}` + secretWord;
    //updateWordDisplay();
}

// Function to handle a guess
function handleGuess() {
    // let rowNumber = 0;
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

    guessedWord = guess;
    attempts++;

    // for (let i = 0; i < secretWord.length; i++) {
    //     if (secretWord[i] === guess[i]) {
    //         // guessedWord = guessedWord.substring(0, i) + guess[i] + guessedWord.substring(i + 1);
    //         // correctPositions.push(guess[i]);
    //         guessedWord = guess.substring(0, i) + guess[i] + guess.substring(i + 1);
    //     }
    //     else if(secretWord.includes(guess[i])){
    //         alert(`Letter "${guess[i]}" is part of word but in wrong position`);
    //     }    
    // }

    updateWordDisplay(rowNumber);

    if (guessedWord === secretWord) {
        resultDisplay.textContent = `Congratulations! You guessed the word "${secretWord}" in ${attempts} attempts.`;
        guessButton.disabled = true;
    } else if (attempts === maxAttempts) {
        resultDisplay.textContent = `Game over! The secret word was "${secretWord}".`;
        guessButton.disabled = true;
    } else {
        rowNumber++;
        resultDisplay.textContent = `Attempts: ${attempts}/${maxAttempts}`;
    }

    guessInput.value = "";
    guessedWord = "_____";
}

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

// Event listener for the guess button
guessButton.addEventListener("click", handleGuess);
