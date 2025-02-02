class NavigationView {
    _navigation = document.querySelector(".dashboard-nav");

    addEventResetStorage(handlerFunction) {
        this._navigation.addEventListener("click", function (clickEvent) {
            const btn = clickEvent.target.closest(".btn-reset-storage");

            // Guard clause.
            if (!btn) return;

            handlerFunction();
        });
    }
}

export default new NavigationView();
