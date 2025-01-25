export const data = {
    gameOver: false,
    scoreX: +localStorage.getItem("score_x") ?? 0,
    scoreO: +localStorage.getItem("score_o") ?? 0,
    currMove: "x",
    fields: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ],
};
