class Checker {
    _winingOptions = ["xxx", "ooo"];

    _checkHorizontalFields(fields) {
        for (const option of this._winingOptions) {
            for (const row of fields) {
                if (row.join("") === option) return true;
            }
        }

        return false;
    }

    _checkVerticalFields(fields) {
        for (const option of this._winingOptions) {
            for (const counter in fields) {
                let result = "";
                for (const row of fields) {
                    result += row[counter];
                }

                if (result === option) return true;
            }
        }

        return false;
    }

    _checkDiagonalFields(fields) {
        for (const option of this._winingOptions) {
            for (const direction of ["left", "right"]) {
                const diagSquares = [0, 1, 2];
                if (direction === "right") diagSquares.reverse();

                let result = "";
                for (const counter in fields) {
                    result += fields[counter][diagSquares[counter]];
                }

                if (result === option) return true;
            }
        }

        return false;
    }

    checkForWinner(fields) {
        if (this._checkHorizontalFields(fields)) return true;
        if (this._checkVerticalFields(fields)) return true;
        if (this._checkDiagonalFields(fields)) return true;

        return false;
    }

    checkForTie(fields) {
        let counter = 0;
        fields.forEach((row) => {
            if (!row.includes(1)) counter++;
        });

        return counter === fields.length;
    }
}

export default new Checker();
