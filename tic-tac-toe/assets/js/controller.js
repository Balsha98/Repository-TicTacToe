import checker from "./helpers/checker.js";
import generator from "./helpers/generator.js";
import helper from "./helpers/helper.js";

// ***** DOM ELEMENTS ***** //
const gameHistoryPopup = document.querySelector(".div-game-history-popup");
const closePopupBtn = document.querySelector(".btn-close-popup");
const paginationBtns = document.querySelectorAll(".btn-pagination");
const scoreHistoryContainer = document.querySelector(".div-score-history-list-container");
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

    const currIcon = helper.switchIcon(currMove);
    this.innerHTML = `<ion-icon name="${currIcon}-outline"></ion-icon>`;

    // Get clicked square coordinates.
    const { row, col } = helper.getSquarePosition(this);
    fields[row][col] = currMove;

    // Check for a winner.
    if (checker.checkForWinner(fields)) {
        gameOver = checker.checkForWinner(fields);
        showConfirmationPopup(true, currIcon);
        updateGameHistory(currMove);
        updateScoreBoard(currMove);
        return;
    }

    // Check for a tie.
    if (checker.checkForTie(fields)) {
        gameOver = checker.checkForTie(fields);
        showConfirmationPopup(false, currIcon);
        // updateGameHistory(currMove);
        return;
    }

    // Alter global variable.
    currMove = helper.switchMove(currMove);

    // Alter the current move visual.
    currMoveIcon.setAttribute("name", `${helper.switchIcon(currMove)}-outline`);
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

    let listItemID = 0;
    let listItem = generator.generateListItem(listItemID);
    const gameHistory = localStorage.getItem("game_history");
    if (gameHistory.length === 0) return;

    scoreHistoryContainer.classList.remove("empty-container");
    for (const { id, winner, date } of JSON.parse(gameHistory)) {
        if (scoreHistoryList.children.length === 0) scoreHistoryList.appendChild(listItem);

        const currInnerList = document.querySelector(`.li-${listItemID} .inner-score-history-list`);
        currInnerList.appendChild(generator.generateInnerListItem(id, winner, date));

        if (id % 5 === 0 || id === JSON.parse(gameHistory).length) {
            scoreHistoryList.appendChild(listItem);
            if (id === JSON.parse(gameHistory).length) break;

            listItem = generator.generateListItem(id / 5);
            scoreHistoryList.appendChild(listItem);
            listItemID = id / 5;
        }
    }

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
        newItem = generator.generateListItem(0);
        scoreHistoryList.appendChild(newItem);
        const latestInnerList = document.querySelector(".li-0 .inner-score-history-list");
        latestInnerList.appendChild(generator.generateInnerListItem(id, winner, date));

        lastPageSpan.textContent = scoreHistoryList.children.length;
        currPageSpan.textContent = id;
    } else {
        const lastListItem = scoreHistoryList.children[totalListItems - 1];
        const lastInnerList = document.querySelector(`.${lastListItem.classList[1]} .inner-score-history-list`);
        const totalInnerItems = lastInnerList.children.length;

        if (totalInnerItems === 5) {
            const newItemID = +lastListItem.dataset.itemIndex + 1;
            lastPageSpan.textContent = newItemID + 1;

            newItem = generator.generateListItem(newItemID);
            scoreHistoryList.appendChild(newItem);
            const latestInnerList = document.querySelector(`.li-${newItemID} .inner-score-history-list`);
            latestInnerList.appendChild(generator.generateInnerListItem(id, winner, date));
        } else {
            newItem = generator.generateInnerListItem(id, winner, date);
            lastInnerList.appendChild(newItem);
        }
    }

    gameHistory.push(newUpdate);
    localStorage.setItem("game_history", JSON.stringify(gameHistory));
};

const resetLocalStorage = function () {
    localStorage.clear();

    scoreHistoryContainer.classList.add("empty-container");
    [currPageSpan, lastPageSpan].forEach((span) => (span.textContent = 0));
    [...scoreHistoryList.children].forEach((listItem) => listItem.remove());

    [scoreLabelX, scoreLabelO].forEach((label) => (label.textContent = 0));
    const resetIcon = document.querySelector(`.${this.classList[0]} ion-icon`);
    resetIcon.style = `transform: rotate(${(rotateDegrees += 360)}deg);`;

    scoreO = 0;
    scoreX = 0;
};

const resetGameVisuals = function () {
    currMove = "x";
    currMoveIcon.setAttribute("name", `${helper.switchIcon(currMove)}-outline`);
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
