class PaginationView {
    _btnPagination = document.querySelectorAll(".btn-pagination");
    _spanCurrPage = document.querySelector(".span-curr-page");
    _spanLastPage = document.querySelector(".span-last-page");
    _currHistoryItem = 0;

    scrollHistory(historyList) {
        const direction = this.classList[1].split("-")[1];
        const totalHistoryItems = [...historyList.children];

        // Guard clause.
        if (totalHistoryItems.length === 0) return;

        if (direction === "backward") {
            if (currHistoryItem === 0) return;
            currPageSpan.textContent = --currHistoryItem + 1;
        } else if (direction === "forward") {
            if (currHistoryItem === totalHistoryItems.length - 1) return;
            currPageSpan.textContent = ++currHistoryItem + 1;
        }

        totalHistoryItems
            .find((list) => +list.dataset.itemIndex === currHistoryItem)
            .scrollIntoView({ behavior: "smooth" });
    }

    addEventScrollHistory(handlerFunction) {
        this._btnPagination.forEach((btn) => {
            btn.addEventListener("click", function () {
                if (direction === "backward") {
                    if (currHistoryItem === 0) return;
                    currPageSpan.textContent = --currHistoryItem + 1;
                } else if (direction === "forward") {
                    if (currHistoryItem === totalHistoryItems.length - 1) return;
                    currPageSpan.textContent = ++currHistoryItem + 1;
                }
            });
        });
    }
}

export default new PaginationView();
