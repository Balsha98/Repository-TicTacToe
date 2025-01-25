class Checker {
    checkForTie(fields) {
        let counter = 0;
        fields.forEach((row) => {
            if (!row.includes(1)) counter++;
        });

        return counter === fields.length;
    }

    checkForWinner(fields) {
        if (this.#checkHorizontalFields(fields)) return true;
        if (this.#checkVerticalFields(fields)) return true;
        if (this.#checkDiagonalFields(fields)) return true;

        return false;
    }

    #checkHorizontalFields(fields) {
        for (const option of ["xxx", "ooo"]) {
            for (const row of fields) {
                if (row.join("") === option) {
                    return true;
                }
            }
        }

        return false;
    }

    #checkVerticalFields(fields) {
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

    #checkDiagonalFields(fields) {
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
}

export default new Checker();
