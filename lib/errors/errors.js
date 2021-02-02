"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameError = exports.TypeError = exports.Expired = exports.ValidationError = exports.UnprocessableError = exports.ArgumentError = exports.DuplicateError = exports.ClientError = exports.ServerError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(status, title, message, options = {}) {
        super(message);
        this.status = status;
        this.title = title;
        this.options = {};
        for (const [key, value] of Object.entries(options)) {
            this.options[key] = value;
        }
    }
    get name() {
        return this.constructor.name;
    }
    get statusCode() {
        return this.status;
    }
    get statusTitle() {
        return this.title;
    }
    get detail() {
        return this.toString();
    }
}
exports.HttpError = HttpError;
class ServerError extends HttpError {
    constructor(message, options = {}) {
        super(500, 'Server Error', message, options);
    }
}
exports.ServerError = ServerError;
class ClientError extends HttpError {
    constructor(message, options = {}) {
        super(400, 'Client Error', message, options);
    }
}
exports.ClientError = ClientError;
class DuplicateError extends HttpError {
    constructor(message, options = {}) {
        super(409, 'Conflict Error', message, options);
    }
}
exports.DuplicateError = DuplicateError;
class ArgumentError extends HttpError {
    constructor(message, options = {}) {
        super(400, 'Client Error', message, options);
    }
}
exports.ArgumentError = ArgumentError;
class UnprocessableError extends HttpError {
    constructor(message, options = {}) {
        super(422, 'Unprocessable Error', message, options);
    }
}
exports.UnprocessableError = UnprocessableError;
class ValidationError extends ClientError {
    constructor(jsonValidationError, options = {}) {
        super(jsonValidationError.toString(), options);
    }
}
exports.ValidationError = ValidationError;
class Expired extends UnprocessableError {
    constructor(message, options = {}) {
        super(message, options);
    }
}
exports.Expired = Expired;
class TypeError extends ServerError {
    constructor(message, options = {}) {
        super(message, options);
    }
}
exports.TypeError = TypeError;
class NameError extends ServerError {
    constructor(message, options = {}) {
        super(message, options);
    }
}
exports.NameError = NameError;
