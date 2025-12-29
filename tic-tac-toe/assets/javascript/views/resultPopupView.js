import PopupView from "./popupView.js";

class ResultPopupView extends PopupView {
    _overlay = document.querySelector(".div-popup-overlay");
    _popup = document.querySelector(".div-confirmation-popup");
    _btnNewGame = document.querySelector(".btn-new-game");

    showPopup(isWinner, icon) {
        const heading = this._popup.querySelector("h2");

        if (isWinner) {
            heading.innerHTML = `
                Player <ion-icon name="${icon}-outline"></ion-icon> Wins!
            `;
        } else {
            heading.innerHTML = "The Game Is Tied!";
        }

        this.togglePopup();
    }

    _resetGame(handlerFunction) {
        this.togglePopup();
        handlerFunction();
    }

    addEventNewGame(handlerFunction) {
        this._btnNewGame.addEventListener("click", this._resetGame.bind(this, handlerFunction));
    }
}

export default new ResultPopupView();
