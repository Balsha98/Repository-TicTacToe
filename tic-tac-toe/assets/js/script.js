"use strict";

// ***** DOM ELEMENTS ***** //
const currMoveSpan = document.querySelector(".span-current-move");
const gameSquares = document.querySelectorAll(".div-game-square");

// ***** GLOBAL VARIABLES ***** //
let gameOver = false;
let currMove = "x";
const fields = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
];

// ***** DOM ELEMENTS ***** //
const markSquare = function () {
    if (!gameOver) {
        if (this.innerHTML === "") {
            const currIcon = currMove === "x" ? "close" : "radio-button-off";
            this.innerHTML = `<ion-icon name="${currIcon}-outline"></ion-icon>`;

            // Get clicked square coordinates.
            const { row, col } = getSquarePosition(this);
            fields[row][col] = currMove;

            // Alter the global variables.
            currMove = switchMove(currMove);
            gameOver = checkForWinner(fields);

            // Alter the current move visual.
            currMoveSpan.textContent = currMove.toUpperCase();
        }
    }
};

const switchMove = function (move) {
    return move === "x" ? "o" : "x";
};

const getSquarePosition = function (square) {
    return { row: square.dataset.row, col: square.dataset.col };
};

const checkForWinner = function (fields) {
    if (checkHorizontalFields(fields)) return true;
    if (checkVerticalFields(fields)) return true;
    if (checkDiagonalFields(fields)) return true;

    return false;
};

const checkHorizontalFields = function (fields) {
    for (const option of ["xxx", "ooo"]) {
        for (const row of fields) {
            if (row.join("") === option) {
                return true;
            }
        }
    }

    return false;
};

const checkVerticalFields = function (fields) {
    for (const option of ["xxx", "ooo"]) {
        for (const counter in fields) {
            let result = "";
            for (const row of fields) {
                result += row[counter];
            }

            if (result === option) {
                return true;
            }
        }
    }

    return false;
};

const checkDiagonalFields = function (fields) {
    for (const option of ["xxx", "ooo"]) {
        for (const direction of ["left", "right"]) {
            const diagSquares = [0, 1, 2];
            if (direction === "right") {
                diagSquares.reverse();
            }

            let result = "";
            for (const counter in fields) {
                result += fields[counter][diagSquares[counter]];
            }

            if (result === option) {
                return true;
            }
        }
    }

    return false;
};

// ***** DOM ELEMENTS ***** //
gameSquares.forEach((gameSquare) => {
    gameSquare.addEventListener("click", markSquare);
});
