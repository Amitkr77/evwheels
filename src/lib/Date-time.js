export const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    });
};