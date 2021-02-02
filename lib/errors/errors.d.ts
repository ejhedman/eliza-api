export declare class HttpError extends Error {
    status: number;
    title: string;
    options: any;
    constructor(status: number, title: string, message: string, options?: any);
    get name(): string;
    get statusCode(): number;
    get statusTitle(): string;
    get detail(): string;
}
export declare class ServerError extends HttpError {
    constructor(message: string, options?: any);
}
export declare class ClientError extends HttpError {
    constructor(message: string, options?: any);
}
export declare class DuplicateError extends HttpError {
    constructor(message: string, options?: any);
}
export declare class ArgumentError extends HttpError {
    constructor(message: string, options?: any);
}
export declare class UnprocessableError extends HttpError {
    constructor(message: string, options?: any);
}
export declare class ValidationError extends ClientError {
    constructor(jsonValidationError: any, options?: any);
}
export declare class Expired extends UnprocessableError {
    constructor(message: string, options?: any);
}
export declare class TypeError extends ServerError {
    constructor(message: string, options?: any);
}
export declare class NameError extends ServerError {
    constructor(message: string, options?: any);
}
