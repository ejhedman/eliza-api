"use strict";
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
exports.APIController = void 0;
const express = require("express");
const hal_serializer_1 = require("hal-serializer");
const controllerBase_1 = require("./controllerBase");
class APIController extends controllerBase_1.ControllerBase {
    constructor(path) {
        super();
        this.router = express.Router();
        this.path = path;
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(`${this.path}/`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.homeControllerAsync(req, res);
        }));
    }
    homeControllerAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = req.apiUrls.baseUrl;
            const serializer = new hal_serializer_1.HALSerializer();
            serializer.register('home', {
                links: (record) => {
                    return {
                        clients: `${baseUrl}/clients`,
                    };
                },
            });
            const serialized = serializer.serialize('home', { version: `v1.0` });
            res.setHeader('Content-type', 'application/json');
            res.status(200).send(serialized);
        });
    }
}
exports.APIController = APIController;
