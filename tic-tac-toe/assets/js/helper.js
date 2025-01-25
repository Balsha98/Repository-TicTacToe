class Helper {
    static switchMove(move) {
        return move === "x" ? "o" : "x";
    }

    static switchIcon(move) {
        return move === "x" ? "close" : "radio-button-off";
    }

    static getSquarePosition(square) {
        return { row: square.dataset.row, col: square.dataset.col };
    }

    static checkForTie() {
        let counter = 0;
        fields.forEach((row) => {
            if (!row.includes(1)) counter++;
        });

        return counter === fields.length;
    }

    static checkForWinner(fields) {
        if (checkHorizontalFields(fields)) return true;
        if (checkVerticalFields(fields)) return true;
        if (checkDiagonalFields(fields)) return true;

        return false;
    }

    static checkHorizontalFields(fields) {
        for (const option of ["xxx", "ooo"]) {
            for (const row of fields) {
                if (row.join("") === option) {
                    return true;
                }
            }
        }

        return false;
    }

    static checkVerticalFields(fields) {
        for (const option of ["xxx", "ooo"]) {
            for (const counter in fields) {
                let result = "";
                for (const row of fields) {
                    result += row[counter];
                }

                if (result === option) {
                    return true;
                }
            }
        }

        return false;
    }

    static checkDiagonalFields(fields) {
        for (const option of ["xxx", "ooo"]) {
            for (const direction of ["left", "right"]) {
                const diagSquares = [0, 1, 2];
                if (direction === "right") {
                    diagSquares.reverse();
                }

                let result = "";
                for (const counter in fields) {
                    result += fields[counter][diagSquares[counter]];
                }

                if (result === option) {
                    return true;
                }
            }
        }

        return false;
    }

    static generateIonIcon(icon) {
        return `<ion-icon name="${switchIcon(icon)}-outline"></ion-icon>`;
    }

    static generateListItem(itemIndex) {
        const listItem = document.createElement("li");
        listItem.classList.add("score-history-list-item");
        listItem.classList.add(`li-${itemIndex}`);
        listItem.dataset.itemIndex = itemIndex;

        const innerList = document.createElement("ul");
        innerList.classList.add("inner-score-history-list");
        listItem.appendChild(innerList);

        return listItem;
    }

    static generateInnerListItem(id, winner, date) {
        const listItem = document.createElement("li");
        listItem.classList.add("inner-score-history-list-item");

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("div-score-history-info");

        const idSpan = document.createElement("span");
        idSpan.textContent = `${id}.`;
        itemDiv.appendChild(idSpan);

        const descText = document.createElement("p");
        descText.innerHTML = `Player ${generateIonIcon(winner)} won this game.`;
        itemDiv.appendChild(descText);
        listItem.appendChild(itemDiv);

        const dateText = document.createElement("p");
        dateText.textContent = formatGameDate(date);
        listItem.appendChild(dateText);

        return listItem;
    }
}

export default Helper;
