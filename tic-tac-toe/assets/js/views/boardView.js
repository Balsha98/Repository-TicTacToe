class BoardView {
    _gameBoard = document.querySelector(".div-game-board-container");
    _btnStartGame = document.querySelector(".btn-start-game");

    setCurrIcon(iconName) {
        this._gameBoard.querySelector(".icon-current-move").setAttribute("name", `${iconName}-outline`);
    }

    addEventStartGame(handlerFunction) {
        this._btnStartGame.addEventListener("click", handlerFunction);
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
