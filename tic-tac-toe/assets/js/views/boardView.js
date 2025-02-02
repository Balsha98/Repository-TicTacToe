class BoardView {
    _gameBoard = document.querySelector(".div-game-board-container");

    addEventMarkSquare(handlerFunction) {
        this._gameBoard.querySelectorAll(".div-game-square").forEach((square) => {
            square.addEventListener("click", handlerFunction);
        });
    }

    setCurrIcon(iconName) {
        this._gameBoard.querySelector(".icon-current-move").setAttribute("name", `${iconName}-outline`);
    }
}

export default new BoardView();
