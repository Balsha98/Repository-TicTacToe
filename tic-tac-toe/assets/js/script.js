"use strict";

// ***** DOM ELEMENTS ***** //
const gameHistoryPopup = document.querySelector(".div-game-history-popup");
const closePopupBtn = document.querySelector(".btn-close-popup");
const scoreHistoryList = document.querySelector(".score-history-list");
const confirmationPopup = document.querySelector(".div-confirmation-popup");
const confirmationIcon = document.querySelector(".icon-confirmation");
const newGameBtn = document.querySelector(".btn-new-game");
const popupOverlayDiv = document.querySelector(".div-popup-overlay");
const gameHistoryBtn = document.querySelector(".btn-game-history");
const resetStorageBtn = document.querySelector(".btn-reset-storage");
const scoreLabelX = document.querySelector(".score-label-x");
const scoreLabelO = document.querySelector(".score-label-o");
const currMoveIcon = document.querySelector(".icon-current-move");
const gameSquares = document.querySelectorAll(".div-game-square");

// ***** GLOBAL VARIABLES ***** //
let gameOver = false;
let scoreX = +localStorage.getItem("score_x") ?? 0;
scoreLabelX.textContent = scoreX;
let scoreO = +localStorage.getItem("score_o") ?? 0;
scoreLabelO.textContent = scoreO;
let rotateDegrees = 0;
let currMove = "x";
const fields = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
];

// ***** DOM ELEMENTS ***** //
const toggleConfirmationPopup = function (icon = "close") {
    confirmationIcon.setAttribute("name", `${icon}-outline`);
    confirmationPopup.classList.toggle("hide-up");
    popupOverlayDiv.classList.toggle("hide-down");
};

const toggleGameHistoryPopup = function () {
    gameHistoryPopup.classList.toggle("hide-up");
    popupOverlayDiv.classList.toggle("hide-down");
};

const markSquare = function () {
    // Guard clause.
    if (gameOver) return;

    // Guard clause.
    if (this.innerHTML !== "") return;

    const currIcon = switchIcon(currMove);
    this.innerHTML = `<ion-icon name="${currIcon}-outline"></ion-icon>`;

    // Get clicked square coordinates.
    const { row, col } = getSquarePosition(this);
    fields[row][col] = currMove;

    // Check for game result.
    if (checkForWinner(fields)) {
        gameOver = checkForWinner(fields);
        toggleConfirmationPopup(currIcon);
        updateGameHistory(currMove);
        updateScoreBoard(currMove);
        return;
    }

    // Alter global variable.
    currMove = switchMove(currMove);

    // Alter the current move visual.
    currMoveIcon.setAttribute("name", `${switchIcon(currMove)}-outline`);
};

const switchMove = function (move) {
    return move === "x" ? "o" : "x";
};

const switchIcon = function (move) {
    return move === "x" ? "close" : "radio-button-off";
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

const updateScoreBoard = function (winner) {
    const winningScore = winner === "x" ? ++scoreX : ++scoreO;
    document.querySelector(`.score-label-${winner}`).textContent = winningScore;
    localStorage.setItem(`score_${winner}`, +winningScore);
};

const loadGameHistory = function () {
    if (!localStorage.getItem("game_history")) return;
    JSON.parse(localStorage.getItem("game_history")).forEach((object) => {
        const listItem = `
            <li class="score-history-list-item">
                <div class="div-score-history-info">
                    <span>${object["id"]}.</span>
                    <p>Player <ion-icon name="${switchIcon(object["winner"])}-outline"></ion-icon> won this game.</p>
                </div>
                <p>${formatGameDate(object["date"])}</p>
            </li>
        `;

        scoreHistoryList.insertAdjacentHTML("beforeend", listItem);
    });
};

const updateGameHistory = function (winner) {
    const gameHistory = JSON.parse(localStorage.getItem("game_history")) ?? [];
    const newUpdate = { id: gameHistory.length + 1, winner: winner, date: new Date().getTime() };
    const listItem = `
        <li class="score-history-list-item">
            <div class="div-score-history-info">
                <span>${newUpdate["id"]}.</span>
                <p>Player <ion-icon name="${switchIcon(winner)}-outline"></ion-icon> won this game.</p>
            </div>
            <p>${formatGameDate(newUpdate["date"])}</p>
        </li>
    `;

    gameHistory.push(newUpdate);
    localStorage.setItem("game_history", JSON.stringify(gameHistory));
    scoreHistoryList.insertAdjacentHTML("beforeend", listItem);
};

const formatGameDate = function (timestamp) {
    return Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
    }).format(timestamp);
};

const resetLocalStorage = function () {
    localStorage.clear();
    [scoreLabelX, scoreLabelO].forEach((label) => (label.textContent = 0));
    [...scoreHistoryList.children].forEach((listItem) => listItem.remove());

    const resetIcon = document.querySelector(`.${this.classList[0]} ion-icon`);
    resetIcon.style = `transform: rotate(${(rotateDegrees += 360)}deg);`;
};

const resetGameVisuals = function () {
    currMove = "x";
    currMoveIcon.setAttribute("name", `${switchIcon(currMove)}-outline`);
    gameSquares.forEach((square) => (square.innerHTML = ""));

    resetGameFieldsArray();
    gameOver = false;
};

const resetGameFieldsArray = function () {
    for (let i in fields) {
        for (let j in fields[i]) {
            fields[i][j] = 1;
        }
    }
};

loadGameHistory();

// ***** DOM ELEMENTS ***** //
newGameBtn.addEventListener("click", function () {
    toggleConfirmationPopup();
    resetGameVisuals();
});

[gameHistoryBtn, closePopupBtn].forEach((btn) => {
    btn.addEventListener("click", toggleGameHistoryPopup);
});

resetStorageBtn.addEventListener("click", resetLocalStorage);

gameSquares.forEach((gameSquare) => {
    gameSquare.addEventListener("click", markSquare);
});
