class HistoryPopupView {
    _overlay = document.querySelector(".div-popup-overlay");
    _popup = document.querySelector(".div-game-history-popup");
    _btnClose = document.querySelector(".btn-close-popup");

    addEventClosePopup(handlerFunction) {
        this._btnClose.addEventListener("click", handlerFunction);
    }

    togglePopup() {
        this._overlay.classList.toggle("hide-down");
        this._popup.classList.toggle("hide-up");
    }
}

export default new HistoryPopupView();
