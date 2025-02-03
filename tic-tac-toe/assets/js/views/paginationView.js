class PaginationView {
    _btnPagination = document.querySelectorAll(".btn-pagination");
    _spanCurrPage = document.querySelector(".span-curr-page");
    _spanLastPage = document.querySelector(".span-last-page");
    _currHistoryItem = 0;

    getCurrHistoryItem() {
        return this._currHistoryItem;
    }

    updateSpanCurrPage(pageNumber) {
        this._spanCurrPage.textContent = pageNumber;
    }

    updateCurrHistoryItem(direction) {
        if (direction === "backward") return --this._currHistoryItem;
        return ++this._currHistoryItem;
    }

    addEventScrollHistory(handlerFunction) {
        this._btnPagination.forEach((btn) => {
            btn.addEventListener("click", function () {
                handlerFunction(this);
            });
        });
    }
}

export default new PaginationView();
