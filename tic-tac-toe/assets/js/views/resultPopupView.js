class ResultPopupView {
    _overlay = document.querySelector(".div-popup-overlay");
    _popup = document.querySelector(".div-confirmation-popup");
    _newGameBtn = document.querySelector(".btn-new-game");

    showPopup(isWinner, icon) {
        const heading = this._popup.querySelector("h2");

        if (isWinner) {
            heading.innerHTML = `
                Player <ion-icon name="${icon}-outline"></ion-icon> Wins!
            `;
        } else {
            heading.innerHTML = "The Game Is Tied!";
        }

        this._togglePopup();
    }

    _resetGame(handlerFunction) {
        this._togglePopup();
        handlerFunction();
    }

    addEventNewGame(handlerFunction) {
        this._newGameBtn.addEventListener("click", this._resetGame.bind(this, handlerFunction));
    }

    _togglePopup() {
        this._overlay.classList.toggle("hide-down");
        this._popup.classList.toggle("hide-up");
    }
}

export default new ResultPopupView();
