export const formatGameDate = function (timestamp) {
    return Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
    }).format(timestamp);
};
