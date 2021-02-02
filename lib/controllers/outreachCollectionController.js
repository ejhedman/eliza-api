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
exports.OutreachCollectionController = void 0;
const express = require("express");
// import { Request, Response } from 'express'
const outreach_1 = require("../models/outreach");
const outreachRepository_1 = require("../repositories/outreachRepository");
const outreachQuery_1 = require("../services/outreachQuery");
const controllerBase_1 = require("./controllerBase");
class OutreachCollectionController extends controllerBase_1.ControllerBase {
    constructor(path, db) {
        super();
        this.router = express.Router();
        this.path = path;
        this.db = db;
        this.outreachRepository = new outreachRepository_1.OutreachRepository(db);
        this.outreachQuery = new outreachQuery_1.OutreachQuery(db);
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
        // list the outreach for given symbol
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
            const outreaches = yield this.outreachRepository.getListAsync(clientId, filter);
            const serialized = outreach_1.Outreach.serializeCollection(req, outreaches);
            // serialized.links.home = `${req.apiUrls.baseUrl}`;
            res.setHeader('Content-type', 'application/json');
            res.status(200).send(serialized);
        });
    }
    getDetailAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientId = req.params.id;
            const outreachId = req.params.id;
            const outreach = yield this.outreachQuery.getDetailAsync(clientId, outreachId, req);
            const serialized = outreach_1.Outreach.serialize(req, outreach);
            res.setHeader('Content-type', 'application/json');
            res.status(200).send(serialized);
        });
    }
}
exports.OutreachCollectionController = OutreachCollectionController;
