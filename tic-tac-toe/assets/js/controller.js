import { POSSIBLE_MOVES } from "./config.js";
import model from "./model.js";
import resultPopupView from "./views/resultPopupView.js";
import historyPopupView from "./views/historyPopupView.js";
import paginationView from "./views/paginationView.js";
import navigationView from "./views/navigationView.js";
import boardView from "./views/boardView.js";
import scoreView from "./views/scoreView.js";
import checker from "./helpers/checker.js";
import generator from "./helpers/generator.js";
import helper from "./helpers/helper.js";

// ***** DOM ELEMENTS ***** //
const paginationBtns = document.querySelectorAll(".btn-pagination");
const currPageSpan = document.querySelector(".span-curr-page");
const lastPageSpan = document.querySelector(".span-last-page");

// ***** GLOBAL VARIABLES ***** //
let currHistoryItem = 0;

// ***** FUNCTIONS ***** //
const controlToggleHistory = function () {
    historyPopupView.togglePopup();
};

const controlLoadHistory = function () {
    historyPopupView.initHistory(model.getStateValue("gameHistory"));
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

        // Update scoreboard.
        scoreView.updateScoreBoard(currMove, model.getStateValue(scoreKey));

        // Update history list.
        historyPopupView.updateHistory(currMove);

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
    controlLoadHistory();

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
