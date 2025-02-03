import { POSSIBLE_MOVES } from "./config.js";
import model from "./model.js";
import resultPopupView from "./views/resultPopupView.js";
import historyPopupView from "./views/historyPopupView.js";
import paginationView from "./views/paginationView.js";
import navigationView from "./views/navigationView.js";
import boardView from "./views/boardView.js";
import scoreView from "./views/scoreView.js";
import checker from "./helpers/checker.js";

// ***** FUNCTIONS ***** //
const controlNewGame = function () {
    // Reset model data.
    model.setStateValue("currMove", "x");
    model.setStateValue("gameOver", false);
    model.resetGameFieldsArray();

    // Reset game board.
    boardView.setCurrIcon(model.getRelatedIcon());
    boardView.resetGameSquares();
};

const controlToggleHistory = function () {
    historyPopupView.togglePopup();
};

const controlScrollHistory = function (currHistoryItem) {
    const totalHistoryItems = [...historyPopupView.getHistoryList().children];

    // Guard clause.
    if (totalHistoryItems.length === 0) return;

    const listToView = totalHistoryItems.find((list) => +list.dataset.itemIndex === currHistoryItem);
    listToView.scrollIntoView({ behavior: "smooth" });
};

const controlResetStorage = function () {
    model.clearLocalStorage();
    historyPopupView.clearHistoryList();
    POSSIBLE_MOVES.forEach((move) => {
        // Update the model.
        const scoreKey = `score${move.toUpperCase()}`;
        model.setStateValue(scoreKey, 0);

        // Update the score view.
        scoreView.updateScoreBoard(move, 0);
    });
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
    const gameFields = model.getStateValue("fields");

    // Check for a winner.
    if (checker.checkForWinner(gameFields)) {
        model.setStateValue("gameOver", true);
        resultPopupView.showPopup(true, currIcon);

        const scoreKey = `score${currMove.toUpperCase()}`;
        const currScore = +model.getStateValue(scoreKey);
        model.setStateValue(scoreKey, currScore + 1);

        // Update scoreboard.
        scoreView.updateScoreBoard(currMove, model.getStateValue(scoreKey));

        // Update history list.
        const latestGame = model.getLatestHistoryUpdate();
        model.setStateValue("gameHistory", latestGame);
        historyPopupView.updateHistory(latestGame);

        return;
    }

    // Check for a tie.
    if (checker.checkForTie(gameFields)) {
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
    historyPopupView.initHistory(model.getStateValue("gameHistory"));
    historyPopupView.addEventClosePopup(controlToggleHistory);
    paginationView.addEventScrollHistory(controlScrollHistory);
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
