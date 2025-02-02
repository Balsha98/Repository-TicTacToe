class Checker {
    _winingOptions = ["xxx", "ooo"];
    _fields = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ];

    markField(row, col, move) {
        this._fields[row][col] = move;
    }

    _checkHorizontalFields() {
        for (const option of this._winingOptions) {
            for (const row of this._fields) {
                if (row.join("") === option) return true;
            }
        }

        return false;
    }

    _checkVerticalFields() {
        for (const option of this._winingOptions) {
            for (const counter in this._fields) {
                let result = "";
                for (const row of this._fields) {
                    result += row[counter];
                }

                if (result === option) return true;
            }
        }

        return false;
    }

    _checkDiagonalFields() {
        for (const option of this._winingOptions) {
            for (const direction of ["left", "right"]) {
                const diagSquares = [0, 1, 2];
                if (direction === "right") diagSquares.reverse();

                let result = "";
                for (const counter in this._fields) {
                    result += this._fields[counter][diagSquares[counter]];
                }

                if (result === option) return true;
            }
        }

        return false;
    }

    checkForWinner() {
        if (this._checkHorizontalFields()) return true;
        if (this._checkVerticalFields()) return true;
        if (this._checkDiagonalFields()) return true;

        return false;
    }

    checkForTie() {
        let counter = 0;
        this._fields.forEach((row) => {
            if (!row.includes(1)) counter++;
        });

        return counter === this._fields.length;
    }

    resetGameFieldsArray() {
        for (let i in this._fields) {
            for (let j in this._fields[i]) {
                this._fields[i][j] = 1;
            }
        }
    }
}

export default new Checker();
