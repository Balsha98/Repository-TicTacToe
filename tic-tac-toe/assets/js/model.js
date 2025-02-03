import { POSSIBLE_MOVES } from "./config.js";

class Model {
    _state = {
        currMove: "x",
        gameOver: false,
        gameHistory: null,
        scoreX: null,
        scoreO: null,
        fields: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ],
    };

    constructor() {
        this._initScore();
        this._initGameHistory();
    }

    // ***** INITIALIZERS ***** //

    _initScore() {
        POSSIBLE_MOVES.forEach((move) => {
            const upper = move.toUpperCase();
            this._state[`score${upper}`] = +localStorage.getItem(`score${upper}`) ?? 0;
        });
    }

    _initGameHistory() {
        this._state.gameHistory = JSON.parse(localStorage.getItem("gameHistory")) ?? [];
    }

    // ***** GETTERS ***** //

    getStateValue(key) {
        return this._state[key];
    }

    getRelatedIcon() {
        return this._state.currMove === "x" ? "close" : "radio-button-off";
    }

    getLatestHistoryUpdate() {
        return {
            id: this._state.gameHistory.length + 1,
            winner: this._state.currMove,
            icon: this.getRelatedIcon(),
            date: new Date().getTime(),
        };
    }

    // ***** SETTERS ***** //

    setStateValue(key, value) {
        if (key.startsWith("score")) {
            localStorage.setItem(key, value);
        } else if (value instanceof Object && !Array.isArray(value)) {
            this._state.gameHistory.push(value);
            localStorage.setItem(key, JSON.stringify(this._state.gameHistory));
            return;
        }

        this._state[key] = value;
    }

    switchMove() {
        return (this._state.currMove = this._state.currMove === "x" ? "o" : "x");
    }

    markField(row, col, move) {
        this._state.fields[row][col] = move;
    }

    // ***** RESETTERS ***** //

    resetGameFieldsArray() {
        this._state.fields.forEach((_, i) => {
            this._state.fields.forEach((_, j) => {
                this._state.fields[i][j] = 1;
            });
        });
    }

    clearLocalStorage() {
        localStorage.clear();
    }
}

export default new Model();
