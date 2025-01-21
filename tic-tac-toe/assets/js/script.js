"use strict";

// ***** DOM ELEMENTS ***** //
const gameHistoryPopup = document.querySelector(".div-game-history-popup");
const closePopupBtn = document.querySelector(".btn-close-popup");
const paginationBtns = document.querySelectorAll(".btn-pagination");
const scoreHistoryList = document.querySelector(".score-history-list");
const currPageSpan = document.querySelector(".span-curr-page");
const lastPageSpan = document.querySelector(".span-last-page");
const confirmationPopup = document.querySelector(".div-confirmation-popup");
const confirmationHeading = document.querySelector(".confirmation-popup-heading");
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
let currHistoryItem = 0;
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
const showConfirmationPopup = function (isWinner, icon) {
    if (isWinner)
        confirmationHeading.innerHTML = `
            Player <ion-icon name="${icon}-outline"></ion-icon> Wins!
        `;
    else confirmationHeading.innerHTML = "The Game Is Tied!";

    confirmationPopup.classList.remove("hide-up");
    popupOverlayDiv.classList.remove("hide-down");
};

const hideConfirmationPopup = function () {
    confirmationPopup.classList.add("hide-up");
    popupOverlayDiv.classList.add("hide-down");
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

    // Check for a winner.
    if (checkForWinner(fields)) {
        gameOver = checkForWinner(fields);
        showConfirmationPopup(true, currIcon);
        updateGameHistory(currMove);
        updateScoreBoard(currMove);
        return;
    }

    // Check for a tie.
    if (checkForTie()) {
        gameOver = checkForTie(fields);
        showConfirmationPopup(false, currIcon);
        // updateGameHistory(currMove);
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

const checkForTie = function () {
    let counter = 0;
    fields.forEach((row) => {
        if (!row.includes(1)) counter++;
    });

    return counter === fields.length;
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

const scrollThroughGameHistory = function () {
    const direction = this.classList[1].split("-")[1];
    const totalHistoryItems = [...scoreHistoryList.children];

    if (direction === "backward") {
        if (currHistoryItem === 0) return;
        currPageSpan.textContent = --currHistoryItem + 1;
    } else if (direction === "forward") {
        if (currHistoryItem === totalHistoryItems.length - 1) return;
        currPageSpan.textContent = ++currHistoryItem + 1;
    }

    totalHistoryItems
        .find((list) => +list.dataset.itemIndex === currHistoryItem)
        .scrollIntoView({ behavior: "smooth" });
};

const loadGameHistory = function () {
    if (!localStorage.getItem("game_history")) return;

    let listData = `
        <li class='score-history-list-item history-list-item-0' data-item-index='0'>
            <ul class='inner-score-history-list'>
    `;

    JSON.parse(localStorage.getItem("game_history")).forEach((object, _, array) => {
        const { id, winner, date } = object;

        listData += `
            <li class="inner-score-history-list-item">
                <div class="div-score-history-info">
                    <span>${id}.</span>
                    <p>Player <ion-icon name="${switchIcon(winner)}-outline"></ion-icon> won this game.</p>
                </div>
                <p>${formatGameDate(date)}</p>
            </li>
        `;

        if (id === array.length) {
            listData += `
                    </ul>
                </li>
            `;
        } else if (id % 5 === 0) {
            listData += `
                    </ul>
                </li>
                <li class='score-history-list-item history-list-item-${id / 5}' data-item-index='${id / 5}'>
                    <ul class='inner-score-history-list'>
            `;
        }
    });

    scoreHistoryList.insertAdjacentHTML("beforeend", listData);
    lastPageSpan.textContent = scoreHistoryList.children.length;
    currPageSpan.textContent = 1;
};

const updateGameHistory = function (winner) {
    const totalListItems = scoreHistoryList.children.length;
    const gameHistory = JSON.parse(localStorage.getItem("game_history")) ?? [];
    const newUpdate = { id: gameHistory.length + 1, winner, date: new Date().getTime() };
    const { id, date } = newUpdate;
    let newItem;

    if (totalListItems === 0) {
        newItem = `
            <li class="score-history-list-item history-list-item-0" data-item-index="0">
                <ul class="inner-score-history-list">
                    <li class="inner-score-history-list-item">
                        <div class="div-score-history-info">
                            <span>${id}.</span>
                            <p>Player <ion-icon name="${switchIcon(winner)}-outline"></ion-icon> won this game.</p>
                        </div>
                        <p>${formatGameDate(date)}</p>
                    </li>
                </ul>
            </li>
        `;

        scoreHistoryList.insertAdjacentHTML("beforeend", newItem);
        lastPageSpan.textContent = scoreHistoryList.children.length;
        currPageSpan.textContent = id;
    } else {
        const lastListItem = scoreHistoryList.children[totalListItems - 1];
        const lastInnerList = document.querySelector(`.${lastListItem.classList[1]} .inner-score-history-list`);
        const numItems = lastInnerList.children.length;

        if (numItems === 5) {
            const newItemID = +lastListItem.dataset.itemIndex + 1;

            newItem = `
                <li class="score-history-list-item history-list-item-${newItemID}" data-item-index="${newItemID}">
                    <ul class="inner-score-history-list">
                        <li class="inner-score-history-list-item">
                            <div class="div-score-history-info">
                                <span>${id}.</span>
                                <p>Player <ion-icon name="${switchIcon(winner)}-outline"></ion-icon> won this game.</p>
                            </div>
                            <p>${formatGameDate(date)}</p>
                        </li>
                    </ul>
                </li>
            `;

            scoreHistoryList.insertAdjacentHTML("beforeend", newItem);
            lastPageSpan.textContent = newItemID + 1;
        } else {
            newItem = `
                <li class="inner-score-history-list-item">
                    <div class="div-score-history-info">
                        <span>${id}.</span>
                        <p>Player <ion-icon name="${switchIcon(winner)}-outline"></ion-icon> won this game.</p>
                    </div>
                    <p>${formatGameDate(date)}</p>
                </li>
            `;

            lastInnerList.insertAdjacentHTML("beforeend", newItem);
        }
    }

    gameHistory.push(newUpdate);
    localStorage.setItem("game_history", JSON.stringify(gameHistory));
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

    scoreO = 0;
    scoreX = 0;
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
    hideConfirmationPopup();
    resetGameVisuals();
});

paginationBtns.forEach((btn) => {
    btn.addEventListener("click", scrollThroughGameHistory);
});

[gameHistoryBtn, closePopupBtn].forEach((btn) => {
    btn.addEventListener("click", toggleGameHistoryPopup);
});

resetStorageBtn.addEventListener("click", resetLocalStorage);

gameSquares.forEach((gameSquare) => {
    gameSquare.addEventListener("click", markSquare);
});
