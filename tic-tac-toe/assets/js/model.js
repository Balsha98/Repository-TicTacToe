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

    _initScore() {
        POSSIBLE_MOVES.forEach((move) => {
            const upper = move.toUpperCase();
            this._state[`score${upper}`] = +localStorage.getItem(`score${upper}`) ?? 0;
        });
    }

    _initGameHistory() {
        this._state.gameHistory = localStorage.getItem("gameHistory") ?? [];
    }

    getStateValue(key) {
        return this._state[key];
    }

    setStateValue(key, value) {
        this._state[key] = value;

        if (key.startsWith("score")) {
            localStorage.setItem(key, value);
        } else if (Array.isArray(value)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    switchMove() {
        return (this._state.currMove = this._state.currMove === "x" ? "o" : "x");
    }

    getRelatedIcon() {
        return this._state.currMove === "x" ? "close" : "radio-button-off";
    }

    markField(row, col, move) {
        this._state.fields[row][col] = move;
    }

    resetGameFieldsArray() {
        this._state.fields.forEach((_, i) => {
            this._state.fields.forEach((_, j) => {
                this._state.fields[i][j] = 1;
            });
        });
    }

    resetLocalStorage() {
        localStorage.clear();
    }
}

export default new Model();
