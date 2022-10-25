class APIError extends Error {
    constructor (message,statusCode) {
        super (message);
        this.statusCode = statusCode;
        this.status = String (statusCode).startsWith ("4") ? "error" : "failed"
    }
};

exports.APIError = APIError;