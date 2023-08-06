"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = exports.SuccessResponse = void 0;
const http_status_codes_1 = require("http-status-codes");
const ResponseEntity = (statusCode, message, data) => {
    if (data) {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: message,
                data: data,
            }),
        };
    }
    else {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: message,
            }),
        };
    }
};
const SuccessResponse = (data) => {
    return ResponseEntity(http_status_codes_1.StatusCodes.OK, "Success", data);
};
exports.SuccessResponse = SuccessResponse;
const ErrorResponse = (code, error) => {
    if (Array.isArray(error)) {
        const errorObject = error[0].constraints;
        const errorMessage = errorObject[Object.keys(errorObject)[0]] || "Error Occurred";
        return ResponseEntity(code, errorMessage, errorMessage);
    }
    return ResponseEntity(code, `${error}`, error);
};
exports.ErrorResponse = ErrorResponse;
//# sourceMappingURL=response.js.map