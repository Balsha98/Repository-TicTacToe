import { POSSIBLE_MOVES } from "../config.js";

class ScoreView {
    initScoreBoard(scores) {
        POSSIBLE_MOVES.forEach((move, i) => this.updateScoreBoard(move, scores[i]));
    }

    updateScoreBoard(move, score) {
        document.querySelector(`.score-label-${move}`).textContent = score;
    }
}

export default new ScoreView();
