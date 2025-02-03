import generator from "./../helpers/generator.js";

class HistoryPopupView {
    _overlay = document.querySelector(".div-popup-overlay");
    _popup = document.querySelector(".div-game-history-popup");
    _btnClose = document.querySelector(".btn-close-popup");
    _historyContainer = document.querySelector(".div-score-history-list-container");
    _historyList = document.querySelector(".score-history-list");

    initHistory(gameHistory) {
        console.log(gameHistory);
        if (!gameHistory) return;

        let listItemID = 0;
        let listItem = generator.generateListItem(listItemID);
        if (gameHistory.length === 0) return;

        this._historyContainer.classList.remove("empty-container");
        for (const { id, winner, date } of gameHistory) {
            if (this._historyList.children.length === 0) this._historyList.appendChild(listItem);

            const currInnerList = document.querySelector(`.li-${listItemID} .inner-score-history-list`);
            currInnerList.appendChild(generator.generateInnerListItem(id, winner, date));

            if (id % 5 === 0 || id === gameHistory.length) {
                this._historyList.appendChild(listItem);
                if (id === JSON.parse(gameHistory).length) break;

                listItem = generator.generateListItem(id / 5);
                this._historyList.appendChild(listItem);
                listItemID = id / 5;
            }
        }

        lastPageSpan.textContent = this._historyList.children.length;
        currPageSpan.textContent = 1;
    }

    updateHistory(move) {
        const totalListItems = this._historyList.children.length;
        const newUpdate = { id: gameHistory.length + 1, winner: move, date: new Date().getTime() };
        const { id, winner, date } = newUpdate;

        let newItem;
        if (totalListItems === 0) {
            newItem = generator.generateListItem(0);
            this._historyList.appendChild(newItem);
            const latestInnerList = document.querySelector(".li-0 .inner-score-history-list");
            latestInnerList.appendChild(generator.generateInnerListItem(id, winner, date));
            this._historyContainer.classList.remove("empty-container");

            lastPageSpan.textContent = this._historyList.children.length;
            currPageSpan.textContent = id;
        } else {
            const lastListItem = this._historyList.children[totalListItems - 1];
            const lastInnerList = document.querySelector(`.${lastListItem.classList[1]} .inner-score-history-list`);
            const totalInnerItems = lastInnerList.children.length;

            if (totalInnerItems === 5) {
                const newItemID = +lastListItem.dataset.itemIndex + 1;
                lastPageSpan.textContent = newItemID + 1;

                newItem = generator.generateListItem(newItemID);
                this._historyList.appendChild(newItem);
                const latestInnerList = document.querySelector(`.li-${newItemID} .inner-score-history-list`);
                latestInnerList.appendChild(generator.generateInnerListItem(id, winner, date));
            } else {
                newItem = generator.generateInnerListItem(id, winner, date);
                lastInnerList.appendChild(newItem);
            }
        }

        gameHistory.push(newUpdate);
        localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
    }

    addEventClosePopup(handlerFunction) {
        this._btnClose.addEventListener("click", handlerFunction);
    }

    togglePopup() {
        this._overlay.classList.toggle("hide-down");
        this._popup.classList.toggle("hide-up");
    }
}

export default new HistoryPopupView();
