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
exports.OutreachResultCollectionController = void 0;
const express = require("express");
// import { Request, Response } from 'express'
const outreachResult_1 = require("../models/outreachResult");
const outreachResultRepository_1 = require("../repositories/outreachResultRepository");
const outreachResultQuery_1 = require("../services/outreachResultQuery");
const controllerBase_1 = require("./controllerBase");
class OutreachResultCollectionController extends controllerBase_1.ControllerBase {
    constructor(path, db) {
        super();
        this.router = express.Router();
        this.path = path;
        this.db = db;
        this.outreachResultRepository = new outreachResultRepository_1.OutreachResultRepository(db);
        this.outreachResultQuery = new outreachResultQuery_1.OutreachResultQuery(db);
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
        // list the outreachResult for given symbol
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
            const clientId = req.params.clientId;
            const filter = req.query;
            const outreachResultes = yield this.outreachResultRepository.getListAsync(clientId, filter);
            const serialized = outreachResult_1.OutreachResult.serializeCollection(req, outreachResultes);
            // serialized.links.home = `${req.apiUrls.baseUrl}`;
            res.setHeader('Content-type', 'application/json');
            res.status(200).send(serialized);
        });
    }
    getDetailAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientId = req.params.id;
            const outreachResultId = req.params.id;
            const outreachResult = yield this.outreachResultQuery.getDetailAsync(clientId, outreachResultId, req);
            const serialized = outreachResult_1.OutreachResult.serialize(req, outreachResult);
            res.setHeader('Content-type', 'application/json');
            res.status(200).send(serialized);
        });
    }
}
exports.OutreachResultCollectionController = OutreachResultCollectionController;
