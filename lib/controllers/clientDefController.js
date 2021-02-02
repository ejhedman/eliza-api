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
exports.ClientDefController = void 0;
const express = require("express");
// import { Request, Response } from 'express'
const clientDef_1 = require("../models/clientDef");
const clientDefRepository_1 = require("../repositories/clientDefRepository");
const clientDefQuery_1 = require("../services/clientDefQuery");
const controllerBase_1 = require("./controllerBase");
class ClientDefController extends controllerBase_1.ControllerBase {
    constructor(path, db) {
        super();
        this.router = express.Router();
        this.path = path;
        this.db = db;
        this.clientDefRepository = new clientDefRepository_1.ClientDefRepository(db);
        this.clientQuery = new clientDefQuery_1.ClientDefQuery(db);
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(`${this.path}/`, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getListAsync(req, res);
            }
            catch (error) {
                res.sendStatus(500);
                next(error); // eslint-disable-line callback-return
            }
        }));
        // list the client for given symbol
        this.router.get(`${this.path}/:id`, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getDetailAsync(req, res);
            }
            catch (error) {
                res.sendStatus(500);
                next(error); // eslint-disable-line callback-return
            }
        }));
    }
    getListAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clients = yield this.clientDefRepository.getListAsync();
            const serialized = clientDef_1.ClientDef.serializeCollection(req, clients);
            // serialized.links.home = `${req.apiUrls.baseUrl}`;
            res.setHeader('Content-type', 'application/json');
            res.status(200).send(serialized);
        });
    }
    getDetailAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientId = req.params.id;
            const client = yield this.clientQuery.getDetailAsync(clientId, req);
            const serialized = clientDef_1.ClientDef.serialize(req, client);
            // serialized.data.links.home = `${req.apiUrls.baseUrl}`;
            res.setHeader('Content-type', 'application/json');
            res.status(200).send(serialized);
        });
    }
}
exports.ClientDefController = ClientDefController;
