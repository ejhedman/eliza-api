"use strict";
// tslint:disable:no-unused-expression
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEventError = exports.handleApiError = void 0;
const errors_1 = require("./errors");
const handleApiError = (error, req, res, logger) => __awaiter(void 0, void 0, void 0, function* () {
    const selfUrl = req.apiUrls.selfUrl;
    const appBase = req.apiUrls.appBase;
    let errorResponse;
    if (error instanceof errors_1.HttpError) {
        errorResponse = {
            errors: [
                {
                    status: error.statusCode,
                    title: error.statusTitle,
                    detail: error.detail,
                    source: { url: selfUrl },
                },
            ],
        };
    }
    else {
        errorResponse = {
            errors: [
                {
                    status: 500,
                    title: 'Server Error',
                    detail: error.message,
                    source: { url: selfUrl },
                    stack: error.stack,
                },
            ],
        };
    }
    const statusCode = error.statusCode || 500;
    logger && logger.error(`Error: ${JSON.stringify(errorResponse)}`);
    res.status(statusCode).send(errorResponse);
});
exports.handleApiError = handleApiError;
const handleEventError = (error, req, res, logger) => __awaiter(void 0, void 0, void 0, function* () {
    const selfUrl = req.apiUrls.selfUrl;
    const appBase = req.apiUrls.appBase;
    let errorResponse;
    if (error instanceof errors_1.HttpError) {
        errorResponse = {
            errors: [
                {
                    status: error.statusCode,
                    title: error.statusTitle,
                    detail: error.detail,
                    source: { url: selfUrl },
                },
            ],
        };
    }
    else {
        errorResponse = {
            errors: [
                {
                    status: 500,
                    title: 'Server Error',
                    detail: error.message,
                    source: { url: selfUrl },
                    stack: error.stack,
                },
            ],
            payload: error.payload,
        };
    }
    // default to "no retry" return code
    const statusCode = 202;
    logger && logger.error(`Error: ${JSON.stringify(errorResponse)}`);
    res.status(statusCode).send(errorResponse);
});
exports.handleEventError = handleEventError;
