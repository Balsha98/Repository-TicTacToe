export default class PopupView {
    _overlay = null;
    _popup = null;

    togglePopup() {
        this._overlay.classList.toggle("hide-down");
        this._popup.classList.toggle("hide-up");
    }
}
