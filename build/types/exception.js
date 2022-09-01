"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
class Exception {
    constructor(message, code) {
        this.message = message;
        this.code = code;
    }
    static fromValidation(validation) {
        return { message: "invalid data provided", errors: validation };
    }
    static fromErrorMessage(message, code = 100) {
        return { message, code };
    }
}
exports.Exception = Exception;
