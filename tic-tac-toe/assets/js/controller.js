import { POSSIBLE_MOVES } from "./config.js";
import model from "./model.js";
import resultPopupView from "./views/resultPopupView.js";
import historyPopupView from "./views/historyPopupView.js";
import navigationView from "./views/navigationView.js";
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
const popupOverlayDiv = document.querySelector(".div-popup-overlay");

// ***** GLOBAL VARIABLES ***** //
let currHistoryItem = 0;

// ***** FUNCTIONS ***** //
const controlToggleHistory = function () {
    historyPopupView.togglePopup();
};

const controlResetStorage = function () {
    model.resetLocalStorage();
    POSSIBLE_MOVES.forEach((move) => {
        // Update the model.
        const scoreKey = `score${move.toUpperCase()}`;
        model.setStateValue(scoreKey, 0);

        // Update the score view.
        scoreView.updateScoreBoard(move, 0);
    });
};

const controlNewGame = function () {
    // Reset model data.
    model.setStateValue("currMove", "x");
    model.setStateValue("gameOver", false);
    model.resetGameFieldsArray();

    // Reset game board.
    boardView.setCurrIcon(model.getRelatedIcon());
    boardView.resetGameSquares();
};

const controlMarkSquare = function (square) {
    // Guard clause.
    if (model.getStateValue("gameOver")) return;

    // Guard clause.
    if (square.innerHTML !== "") return;

    const currMove = model.getStateValue("currMove");
    const currIcon = model.getRelatedIcon();
    square.innerHTML = `
        <ion-icon name="${currIcon}-outline"></ion-icon>
    `;

    // Get clicked square coordinates.
    const { row, col } = square.dataset;
    model.markField(row, col, currMove);

    // Check for a winner.
    if (checker.checkForWinner(model.getStateValue("fields"))) {
        model.setStateValue("gameOver", true);
        resultPopupView.showPopup(true, currIcon);

        const scoreKey = `score${currMove.toUpperCase()}`;
        const currScore = +model.getStateValue(scoreKey);
        model.setStateValue(scoreKey, currScore + 1);

        scoreView.updateScoreBoard(currMove, model.getStateValue(scoreKey));

        // updateGameHistory(currMove);
        return;
    }

    // Check for a tie.
    if (checker.checkForTie(model.getStateValue("fields"))) {
        model.setStateValue("gameOver", true);
        resultPopupView.showPopup(false, currIcon);
        return;
    }

    // Get to the next move.
    model.switchMove();

    // Update the move tracker icon.
    boardView.setCurrIcon(model.getRelatedIcon());
};

const initController = function () {
    resultPopupView.addEventNewGame(controlNewGame);
    historyPopupView.addEventClosePopup(controlToggleHistory);
    navigationView.addEventShowHistory(controlToggleHistory);
    navigationView.addEventResetStorage(controlResetStorage);
    boardView.addEventMarkSquare(controlMarkSquare);

    const scores = [];
    POSSIBLE_MOVES.forEach((move) => {
        scores.push(model.getStateValue(`score${move.toUpperCase()}`));
    });

    scoreView.initScoreBoard(scores);
};

initController();

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
    if (!localStorage.getItem("gameHistory")) return;

    let listItemID = 0;
    let listItem = generator.generateListItem(listItemID);
    const gameHistory = localStorage.getItem("gameHistory");
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
    const gameHistory = JSON.parse(localStorage.getItem("gameHistory")) ?? [];
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
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
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

// ***** DOM ELEMENTS ***** //
paginationBtns.forEach((btn) => {
    btn.addEventListener("click", scrollThroughGameHistory);
});
