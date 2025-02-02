import model from "./model.js";
import boardView from "./views/boardView.js";
import scoreView from "./views/scoreView.js";
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
// const gameSquares = document.querySelectorAll(".div-game-square");

// ***** GLOBAL VARIABLES ***** //
let currHistoryItem = 0;
let rotateDegrees = 0;

// ***** DOM ELEMENTS ***** //
const showConfirmationPopup = function (isWinner, icon) {
    if (isWinner) {
        confirmationHeading.innerHTML = `
            Player <ion-icon name="${icon}-outline"></ion-icon> Wins!
        `;
    } else {
        confirmationHeading.innerHTML = "The Game Is Tied!";
    }

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

const controlMarkSquare = function () {
    // Guard clause.
    if (model.getStateValue("gameOver")) return;

    // Guard clause.
    if (this.innerHTML !== "") return;

    const currMove = model.getStateValue("currMove");
    const currIcon = model.getRelatedIcon();
    this.innerHTML = `
        <ion-icon name="${currIcon}-outline"></ion-icon>
    `;

    // Get clicked square coordinates.
    const { row, col } = this.dataset;
    checker.markField(row, col, currMove);

    // Check for a winner.
    if (checker.checkForWinner()) {
        model.setStateValue("gameOver", true);
        showConfirmationPopup(true, currIcon);

        const scoreKey = `score${currMove.toUpperCase()}`;
        const currScore = +model.getStateValue(scoreKey);
        model.setStateValue(scoreKey, currScore + 1);

        scoreView.updateScoreBoard(currMove, model.getStateValue(scoreKey));

        // updateGameHistory(currMove);
        return;
    }

    // Check for a tie.
    if (checker.checkForTie()) {
        model.setStateValue("gameOver", true);
        showConfirmationPopup(false, currIcon);
        return;
    }

    model.switchMove();

    boardView.setCurrIcon(model.getRelatedIcon());
};

const initEventHandlers = function () {
    boardView.addEventMarkSquare(controlMarkSquare);
};

initEventHandlers();

const updateScoreBoard = function (winner) {
    const winningScore = winner === "x" ? ++scoreX : ++scoreO;
    document.querySelector(`.score-label-${winner}`).textContent = winningScore;
    localStorage.setItem(`score_${winner}`, +winningScore);
};

const scrollThroughGameHistory = function () {
    const direction = this.classList[1].split("-")[1];
    const totalHistoryItems = [...scoreHistoryList.children];

    // Guard clause.
    if (totalHistoryItems.length === 0) return;

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
        scoreHistoryContainer.classList.remove("empty-container");

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
