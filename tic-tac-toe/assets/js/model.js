import { POSSIBLE_MOVES } from "./config.js";

class Model {
    _state = {
        currMove: "x",
        gameOver: false,
        scoreX: null,
        scoreO: null,
    };

    constructor() {
        this._initScore();
    }

    _initScore() {
        POSSIBLE_MOVES.forEach((move) => {
            this._state[`score${move.toUpperCase()}`] = localStorage.getItem(`score_${move}`) ?? 0;
        });
    }

    getStateValue(key) {
        return this._state[key];
    }

    setStateValue(key, value) {
        this._state[key] = value;
    }

    switchMove() {
        return (this._state.currMove = this._state.currMove === "x" ? "o" : "x");
    }

    getRelatedIcon() {
        return this._state.currMove === "x" ? "close" : "radio-button-off";
    }
}

export default new Model();
