import { POSSIBLE_MOVES } from "../config.js";

class ScoreView {
    constructor() {
        this._initScoreBoard();
    }

    _initScoreBoard() {
        POSSIBLE_MOVES.forEach((move) => this.updateScoreBoard(move, 0));
    }

    updateScoreBoard(move, score) {
        document.querySelector(`.score-label-${move}`).textContent = score;
    }
}

export default new ScoreView();
