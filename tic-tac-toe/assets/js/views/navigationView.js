class NavigationView {
    _btnReset = document.querySelector(".btn-reset-storage");
    _rotateDegrees = 0;

    _resetStorage(handlerFunction) {
        // Rotate reset icon.
        this._btnReset.querySelector("ion-icon").style = `
            transform: rotate(${(this._rotateDegrees += 360)}deg);
        `;

        // Call handler.
        handlerFunction();
    }

    addEventResetStorage(handlerFunction) {
        this._btnReset.addEventListener("click", this._resetStorage.bind(this, handlerFunction));
    }
}

export default new NavigationView();
