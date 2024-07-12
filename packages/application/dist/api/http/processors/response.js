export const ok = (message, data) => ({
    status: "000",
    message: message || "Success",
    data,
});
export const badRequest = (message, errors) => ({
    status: "400",
    message: message || "Bad Request",
    errors,
});
