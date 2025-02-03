import PopupView from "./popupView.js";
import generator from "./../helpers/generator.js";

class HistoryPopupView extends PopupView {
    _overlay = document.querySelector(".div-popup-overlay");
    _popup = document.querySelector(".div-game-history-popup");
    _btnClose = document.querySelector(".btn-close-popup");
    _historyContainer = document.querySelector(".div-score-history-list-container");
    _historyList = document.querySelector(".score-history-list");
    _spanCurrPage = document.querySelector(".span-curr-page");
    _spanLastPage = document.querySelector(".span-last-page");

    initHistory(gameHistory) {
        if (!gameHistory) return;

        let listItemID = 0;
        let listItem = generator.generateListItem(listItemID);
        if (gameHistory.length === 0) return;

        this._historyContainer.classList.remove("empty-container");
        for (const { id, icon, date } of gameHistory) {
            if (this._historyList.children.length === 0) this._historyList.appendChild(listItem);

            const currInnerList = document.querySelector(`.li-${listItemID} .inner-score-history-list`);
            currInnerList.appendChild(generator.generateInnerListItem(id, icon, date));

            if (id % 5 === 0 || id === gameHistory.length) {
                this._historyList.appendChild(listItem);
                if (id === gameHistory.length) break;

                listItem = generator.generateListItem(id / 5);
                this._historyList.appendChild(listItem);
                listItemID = id / 5;
            }
        }

        this._spanLastPage.textContent = this._historyList.children.length;
        this._spanCurrPage.textContent = 1;
    }

    getHistoryList() {
        return this._historyList;
    }

    updateHistory(newUpdate) {
        console.log(this._historyList);
        const totalListItems = this._historyList.children.length;
        const { id, icon, date } = newUpdate;

        let newItem;
        if (totalListItems === 0) {
            newItem = generator.generateListItem(0);
            this._historyList.appendChild(newItem);
            const latestInnerList = document.querySelector(".li-0 .inner-score-history-list");
            latestInnerList.appendChild(generator.generateInnerListItem(id, icon, date));
            this._historyContainer.classList.remove("empty-container");

            this._spanLastPage.textContent = this._historyList.children.length;
            this._spanCurrPage.textContent = id;
        } else {
            const lastListItem = this._historyList.children[totalListItems - 1];
            const lastInnerList = document.querySelector(`.${lastListItem.classList[1]} .inner-score-history-list`);
            const totalInnerItems = lastInnerList.children.length;

            if (totalInnerItems === 5) {
                const newItemID = +lastListItem.dataset.itemIndex + 1;
                this._spanLastPage.textContent = newItemID + 1;

                newItem = generator.generateListItem(newItemID);
                this._historyList.appendChild(newItem);
                const latestInnerList = document.querySelector(`.li-${newItemID} .inner-score-history-list`);
                latestInnerList.appendChild(generator.generateInnerListItem(id, icon, date));
            } else {
                newItem = generator.generateInnerListItem(id, icon, date);
                lastInnerList.appendChild(newItem);
            }
        }
    }

    addEventClosePopup(handlerFunction) {
        this._btnClose.addEventListener("click", handlerFunction);
    }

    clearHistoryList() {
        this._historyContainer.classList.add("empty-container");
        [this._spanCurrPage, this._spanLastPage].forEach((span) => (span.textContent = 0));
        [...this._historyList.children].forEach((listItem) => listItem.remove());
    }
}

export default new HistoryPopupView();
