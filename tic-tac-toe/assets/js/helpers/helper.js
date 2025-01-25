class Helper {
    switchMove(move) {
        return move === "x" ? "o" : "x";
    }

    switchIcon(move) {
        return move === "x" ? "close" : "radio-button-off";
    }

    getSquarePosition(square) {
        return { row: square.dataset.row, col: square.dataset.col };
    }

    formatGameDate(timestamp) {
        return Intl.DateTimeFormat("en-US", {
            dateStyle: "short",
        }).format(timestamp);
    }
}

export default new Helper();
