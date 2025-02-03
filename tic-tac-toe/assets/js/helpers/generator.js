import helper from "./helper.js";

class Generator {
    generateListItem(itemIndex) {
        const listItem = document.createElement("li");
        listItem.classList.add("score-history-list-item");
        listItem.classList.add(`li-${itemIndex}`);
        listItem.dataset.itemIndex = itemIndex;

        const innerList = document.createElement("ul");
        innerList.classList.add("inner-score-history-list");
        listItem.appendChild(innerList);

        return listItem;
    }

    generateInnerListItem(id, move, date) {
        const listItem = document.createElement("li");
        listItem.classList.add("inner-score-history-list-item");

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("div-score-history-info");

        const idSpan = document.createElement("span");
        idSpan.textContent = `${id}.`;
        itemDiv.appendChild(idSpan);

        const descText = document.createElement("p");
        descText.innerHTML = `
            Player <ion-icon name="${move === "x" ? "close" : "radio-button-off"}-outline"></ion-icon> won this game.
        `;

        itemDiv.appendChild(descText);
        listItem.appendChild(itemDiv);

        const dateText = document.createElement("p");
        dateText.textContent = helper.formatGameDate(date);
        listItem.appendChild(dateText);

        return listItem;
    }
}

export default new Generator();
