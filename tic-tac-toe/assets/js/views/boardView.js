class BoardView {
    _gameBoard = document.querySelector(".div-game-board-container");

    setCurrIcon(iconName) {
        this._gameBoard.querySelector(".icon-current-move").setAttribute("name", `${iconName}-outline`);
    }

    addEventMarkSquare(handlerFunction) {
        this._gameBoard.addEventListener("click", function (clickEvent) {
            const square = clickEvent.target.closest(".div-game-square");

            // Guard clause.
            if (!square) return;

            handlerFunction(square);
        });
    }

    resetGameSquares() {
        this._gameBoard.querySelectorAll(".div-game-square").forEach((squareDiv) => {
            squareDiv.innerHTML = "";
        });
    }
}

export default new BoardView();
