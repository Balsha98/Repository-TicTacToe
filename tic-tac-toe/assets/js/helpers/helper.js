class Helper {
    formatGameDate(timestamp) {
        return Intl.DateTimeFormat("en-US", {
            dateStyle: "short",
        }).format(timestamp);
    }
}

export default new Helper();
